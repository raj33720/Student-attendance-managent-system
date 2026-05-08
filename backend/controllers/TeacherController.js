const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const {
    normalizeText,
    normalizeLower,
    exactCI,
    canonicalBranch,
    canonicalCourse,
    normalizeYearOrSemester,
    normalizeRoll,
    normalizeSubjectCode,
    branchFilter,
    courseFilter,
    numericStringFilter
} = require('../utils/normalization');

const secretKey = process.env.SECRET_KEY;
const tokenExpiry = process.env.JWT_EXPIRES_IN || '12h';

module.exports.registerTeacher = async (req, res) => {
    const { name, email, contact, branch, password } = req.body;
    try {
        const normalizedEmail = normalizeLower(email);
        const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
        const exists = await Teacher.findOne({ email: exactCI(normalizedEmail) });
        if (exists) {
            return res.status(203).json({ "msg": "User is already registered." })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        const teacher = await Teacher.create({
            name: normalizeText(name),
            email: normalizedEmail,
            contact: normalizeText(contact),
            branch: normalizedBranch,
            password: hashedPwd
        });
        const token = jwt.sign(
            { id: teacher._id.toString(), name: teacher.name, email: teacher.email, branch: teacher.branch, role: 'teacher' },
            secretKey,
            { expiresIn: tokenExpiry }
        );
        return res.status(200).json({ "res": token, "msg": "Registered Succesfully!!" });
    } catch (error) {
        console.log("Insert Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.loginTeacher = async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = normalizeLower(email);
        const teacher = await Teacher.findOne({ email: exactCI(normalizedEmail) });
        if (!teacher) {
            return res.status(203).json({ "msg": "User not registered!!" });
        }
        const pwdCheck = await bcrypt.compare(password, teacher.password);
        if (!pwdCheck) {
            return res.status(203).json({ "msg": "Invalid Credentials" })
        }
        const token = jwt.sign(
            { id: teacher._id.toString(), name: teacher.name, email: teacher.email, branch: teacher.branch, role: 'teacher' },
            secretKey,
            { expiresIn: tokenExpiry }
        );
        return res.status(200).json({ "msg": "Logged in succesfully!!.", "data": token })
    } catch (error) {
        console.log("Login Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getSubjByYear = async (req, res) => {
    const { teacher_id, course, year, branch, semester } = req.body;
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    const normalizedSemester = normalizeYearOrSemester(semester);
    const normalizedTeacherId = normalizeText(teacher_id);
    try {
        if (!normalizedCourse || !normalizedYear || !normalizedBranch) {
            return res.status(203).json({ "msg": "Please select course, year and branch." });
        }

        const query = {
            course: courseFilter(normalizedCourse),
            year: numericStringFilter(normalizedYear),
            branch: branchFilter(normalizedBranch)
        };
        if (normalizedSemester) {
            query.semester = numericStringFilter(normalizedSemester);
        }

        let subjects = [];
        if (normalizedTeacherId) {
            subjects = await Subject.find({ ...query, teacher_id: normalizedTeacherId }).sort({ code: 1, name: 1 });
        }
        if (subjects.length === 0) {
            subjects = await Subject.find(query).sort({ code: 1, name: 1 });
        }
        if (subjects.length === 0) {
            // Legacy fallback: some older records may have inconsistent branch text.
            const relaxedQuery = {
                course: courseFilter(normalizedCourse),
                year: numericStringFilter(normalizedYear)
            };
            if (normalizedTeacherId) {
                subjects = await Subject.find({ ...relaxedQuery, teacher_id: normalizedTeacherId }).sort({ code: 1, name: 1 });
            }
            if (subjects.length === 0) {
                subjects = await Subject.find(relaxedQuery).sort({ code: 1, name: 1 });
            }
        }
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}


module.exports.getStudentsBySubject = async (req, res) => {
    const { course, year, semester, branch } = req.body;
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedSemester = normalizeYearOrSemester(semester);
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    try {
        if (!normalizedCourse || !normalizedYear || !normalizedSemester || !normalizedBranch) {
            return res.status(203).json({ "msg": "Please select course, year, semester and branch." });
        }

        const query = {};
        query.course = courseFilter(normalizedCourse);
        query.branch = branchFilter(normalizedBranch);
        query.semester = numericStringFilter(normalizedSemester);
        query.year = numericStringFilter(normalizedYear);
        const students = await Student.find(query)
            .select('-password')
            .sort({ roll: 1 });
        if (students.length > 0) {
            return res.status(200).json({ "data": students.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": students, "msg": "No Students  Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.takeAttendance = async (req, res) => {
    const { subject, year, semester, attendance, date, course, branch } = req.body;
    const normalizedSubject = normalizeSubjectCode(subject);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedSemester = normalizeYearOrSemester(semester);
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    try {
        if (!normalizedSubject || !normalizedYear || !normalizedSemester || !Array.isArray(attendance) || !attendance.length) {
            return res.status(203).json({ "msg": "Invalid attendance payload." });
        }

        const now = date ? new Date(date) : new Date();
        const yyyy = now.getFullYear().toString();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const dateValue = new Date(`${dateKey}T00:00:00.000Z`);

        const alreadyRecorded = await Attendance.exists(
            {
                subject: exactCI(normalizedSubject),
                year: numericStringFilter(normalizedYear),
                semester: numericStringFilter(normalizedSemester),
                dateKey
            }
        );
        if (alreadyRecorded) {
            return res.status(203).json({ "msg": "Attendance already Recorded!" });
        }

        const allowedStatuses = new Set(['present', 'absent', 'leave']);
        const docs = attendance.map((a) => ({
            roll: normalizeRoll(a.roll),
            year: normalizeYearOrSemester(normalizedYear),
            semester: normalizeYearOrSemester(normalizedSemester),
            subject: normalizedSubject,
            status: allowedStatuses.has(normalizeLower(a.status)) ? normalizeLower(a.status) : 'absent',
            course: normalizedCourse || undefined,
            branch: normalizedBranch || undefined,
            date: dateValue,
            dateKey
        })).filter((entry) => !!entry.roll);

        if (!docs.length) {
            return res.status(203).json({ "msg": "No valid student rolls found." });
        }

        await Attendance.insertMany(docs);
        return res.status(200).json({ "msg": "Attendance Recorded Succesfully!!" })
    } catch (error) {
        console.log("Insert Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getAttendanceBySubject = async (req, res) => {
    const { course, year, branch, subject } = req.body;
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    const normalizedSubject = normalizeSubjectCode(subject);

    try {
        if (!normalizedCourse || !normalizedYear || !normalizedBranch || !normalizedSubject) {
            return res.status(203).json({ "msg": "Please select course, year, branch and subject." });
        }

        const students = await Student.find({
            course: courseFilter(normalizedCourse),
            year: numericStringFilter(normalizedYear),
            branch: branchFilter(normalizedBranch)
        })
            .select('-password')
            .sort({ roll: 1 });

        if (!students.length) {
            return res.status(203).json({ "res": students, "msg": "No records  Found!" });
        }
        const resData = await Promise.all(
            students.map(async (st) => {
                const records = await Attendance.find({
                    roll: exactCI(st.roll),
                    subject: exactCI(normalizedSubject),
                    year: numericStringFilter(normalizedYear)
                }).sort({ date: -1 });
                return {
                    roll: st.roll,
                    name: st.name,
                    attendance: records.map((r) => r.toJSON())
                };
            })
        );
        const hasAnyAttendance = resData.some((st) => st.attendance.length > 0);
        if (!hasAnyAttendance) {
            return res.status(203).json({ "msg": "No records  Found!" });
        }
        return res.status(200).json({ "data": resData })
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.updateAttendance = async (req, res) => {
    console.log("Inside Controller")
    const { id, status } = req.body;
    console.log("req body : ", req.body);
    try {
        const updated = await Attendance.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (updated) {
            return res.status(200).json({ "data": updated.toJSON(), "msg": "Updated!" })
        }
        return res.status(203).json({ "msg": "Oops !! Cannot Update" });
    } catch (error) {
        console.log("Update Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getTeacherDashboardSummary = async (req, res) => {
    const { branch, course, year, semester, subject } = req.body;
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedSemester = normalizeYearOrSemester(semester);
    const normalizedSubject = normalizeSubjectCode(subject);

    try {
        if (!normalizedBranch) {
            return res.status(203).json({ msg: "Teacher branch not found." });
        }

        const studentQuery = {
            branch: branchFilter(normalizedBranch)
        };
        if (normalizedCourse) {
            studentQuery.course = courseFilter(normalizedCourse);
        }
        if (normalizedYear) {
            studentQuery.year = numericStringFilter(normalizedYear);
        }
        if (normalizedSemester) {
            studentQuery.semester = numericStringFilter(normalizedSemester);
        }

        const students = await Student.find(studentQuery)
            .select('-password')
            .sort({ roll: 1 });

        if (!students.length) {
            return res.status(200).json({ data: [] });
        }

        const rolls = students.map((s) => normalizeRoll(s.roll)).filter(Boolean);
        const attendanceQuery = {
            roll: { $in: rolls.map((r) => exactCI(r)) }
        };
        if (normalizedCourse) {
            attendanceQuery.course = courseFilter(normalizedCourse);
        }
        if (normalizedYear) {
            attendanceQuery.year = numericStringFilter(normalizedYear);
        }
        if (normalizedSemester) {
            attendanceQuery.semester = numericStringFilter(normalizedSemester);
        }
        if (normalizedSubject) {
            attendanceQuery.subject = exactCI(normalizedSubject);
        }
        if (normalizedBranch) {
            attendanceQuery.branch = branchFilter(normalizedBranch);
        }

        const records = await Attendance.find(attendanceQuery)
            .select('roll status subject date')
            .sort({ date: -1 });

        const grouped = new Map();
        records.forEach((rec) => {
            const key = normalizeRoll(rec.roll);
            if (!grouped.has(key)) {
                grouped.set(key, {
                    present: 0,
                    absent: 0,
                    leave: 0,
                    total: 0,
                    lastMarkedAt: rec.date
                });
            }
            const stats = grouped.get(key);
            if (rec.status === 'present') stats.present += 1;
            else if (rec.status === 'absent') stats.absent += 1;
            else stats.leave += 1;
            stats.total += 1;
            if (!stats.lastMarkedAt || new Date(rec.date) > new Date(stats.lastMarkedAt)) {
                stats.lastMarkedAt = rec.date;
            }
        });

        const rows = students.map((student) => {
            const key = normalizeRoll(student.roll);
            const stats = grouped.get(key) || { present: 0, absent: 0, leave: 0, total: 0, lastMarkedAt: null };
            const denominator = stats.present + stats.absent;
            const percentage = denominator ? Number(((stats.present / denominator) * 100).toFixed(2)) : 0;
            return {
                roll: student.roll,
                name: student.name,
                course: student.course,
                year: student.year,
                semester: student.semester,
                branch: student.branch,
                present: stats.present,
                absent: stats.absent,
                leave: stats.leave,
                total: stats.total,
                percentage,
                lastMarkedAt: stats.lastMarkedAt
            };
        });

        return res.status(200).json({ data: rows });
    } catch (error) {
        console.log("Dashboard Fetch Error: ", error);
        return res.status(500).json({ msg: "Database error" });
    }
};
