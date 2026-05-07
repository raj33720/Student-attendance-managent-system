require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
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

module.exports.registerStudent = async(req, res) => {
    const { name, roll, course } = req.body;
    try {
        const normalizedRoll = normalizeRoll(roll);
        const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
        const normalizedBranch = canonicalBranch(req.body.branch) || normalizeText(req.body.branch);
        const normalizedYear = normalizeYearOrSemester(req.body.year);
        const normalizedSemester = normalizeYearOrSemester(req.body.semester);
        const exists = await Student.findOne({ roll: exactCI(normalizedRoll) });
        if (exists) {
            return res.status(409).json({ msg: "Student already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);
        const student = await Student.create({
            ...req.body,
            roll: normalizedRoll,
            course: normalizedCourse,
            branch: normalizedBranch,
            year: normalizedYear,
            semester: normalizedSemester,
            name: normalizeText(name),
            password: hashedPwd
        });
        const token = jwt.sign(
            {
                id: student._id.toString(),
                roll: student.roll,
                name: student.name,
                course: student.course,
                year: student.year,
                semester: student.semester,
                branch: student.branch
            },
            secretKey
        );
        return res.status(200).json({
            msg: "Student registered successfully",
            res: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "DB error" });
    }
};


module.exports.loginStudent = async(req, res) => {
    const { roll, password } = req.body;
    try {
        const normalizedRoll = normalizeRoll(roll);
        const student = await Student.findOne({ roll: exactCI(normalizedRoll) });
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        const pwdCheck = await bcrypt.compare(password, student.password);
        if (!pwdCheck) {
            return res.status(203).json({ msg: "Invalid Credentials" });
        }
        const token = jwt.sign(
            {
                id: student._id.toString(),
                roll: student.roll,
                name: student.name,
                course: student.course,
                year: student.year,
                semester: student.semester,
                branch: student.branch
            },
            secretKey
        );
        return res.status(200).json({
            msg: "Login successful",
            data: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "DB error" });
    }
};


module.exports.getSubjects = async(req, res) => {
    const { branch, semester, course, year } = req.body;
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    const normalizedSemester = normalizeYearOrSemester(semester);
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);

    if (!normalizedCourse || !normalizedYear || !normalizedBranch) {
        return res.status(203).json({ msg: "Student profile is incomplete. Please set course, year and branch." });
    }
    try {
        const query = {
            course: courseFilter(normalizedCourse),
            year: numericStringFilter(normalizedYear),
            branch: branchFilter(normalizedBranch)
        };
        if (normalizedSemester) query.semester = numericStringFilter(normalizedSemester);

        let subjects = await Subject.find(query).sort({ code: 1, name: 1 });

        if (!subjects.length && normalizedSemester) {
            const fallbackQuery = {
                course: courseFilter(normalizedCourse),
                year: numericStringFilter(normalizedYear),
                branch: branchFilter(normalizedBranch)
            };
            subjects = await Subject.find(fallbackQuery).sort({ semester: 1, code: 1, name: 1 });
        }

        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) });
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Database Error: ", error);
        return res.status(500).json({ "msg": "Database connection error" });
    }
}

module.exports.getattendance = async(req, res) => {
    const { roll, subject, year, semester } = req.body;
    const normalizedRoll = normalizeRoll(roll);
    const normalizedSubject = normalizeSubjectCode(subject);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedSemester = normalizeYearOrSemester(semester);
    try {
        const query = {};
        if (!normalizedRoll) {
            return res.status(203).json({ msg: "Invalid roll number" });
        }
        query.roll = exactCI(normalizedRoll);
        if (normalizedSubject) {
            query.subject = exactCI(normalizedSubject);
        }
        if (normalizedYear) {
            query.year = numericStringFilter(normalizedYear);
        }
        if (normalizedSemester) {
            query.semester = numericStringFilter(normalizedSemester);
        }

        let attendance = await Attendance.find(query).sort({ date: -1 });
        if (!attendance.length && normalizedSemester) {
            const fallbackQuery = { ...query };
            delete fallbackQuery.semester;
            attendance = await Attendance.find(fallbackQuery).sort({ date: -1 });
        }

        if (!attendance.length) {
            return res.status(203).json({ msg: "No attendance records found" });
        }
        return res.status(200).json({ data: attendance.map((a) => a.toJSON()) });
    } catch (error) {
        console.log("Database Error:", error);
        return res.status(500).json({ msg: "Database error" });
    }
};
