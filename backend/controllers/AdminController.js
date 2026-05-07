require('dotenv').config();
const jwt = require('jsonwebtoken');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const {
    normalizeText,
    normalizeLower,
    exactCI,
    canonicalBranch,
    canonicalCourse,
    normalizeYearOrSemester,
    normalizeSubjectCode,
    branchFilter,
    courseFilter,
    numericStringFilter
} = require('../utils/normalization');

const USERNAME = "admin";
const PWD = "admin";
const secretKey = process.env.SECRET_KEY;

module.exports.loginAdmin = async(req, res) => {
    console.log("Inside Controller")
    const { username, password } = req.body;
    console.log("req body : ", req.body);
    if (username == USERNAME && password == PWD) {
        // const resData = JSON.stringify(response[0]);
        var token = jwt.sign(req.body, secretKey);
        return res.status(200).json({ "msg": "Logged in succesfully!!.", "data": token })
    } else {
        return res.status(203).json({ "msg": "Invalid Credentials" })
    }
}

module.exports.addSubject = async(req, res) => {
    const { code } = req.body;
    const normalizedCode = normalizeSubjectCode(code);
    const normalizedCourse = canonicalCourse(req.body.course) || normalizeLower(req.body.course);
    const normalizedBranch = canonicalBranch(req.body.branch) || normalizeText(req.body.branch);
    const normalizedYear = normalizeYearOrSemester(req.body.year);
    const normalizedSemester = normalizeYearOrSemester(req.body.semester);
    try {
        const exists = await Subject.findOne({ code: exactCI(normalizedCode) });
        if (exists) {
            return res.status(203).json({ "msg": "Subject is already Added." })
        }
        await Subject.create({
            ...req.body,
            code: normalizedCode,
            name: normalizeText(req.body.name),
            course: normalizedCourse,
            branch: normalizedBranch,
            year: normalizedYear,
            semester: normalizedSemester,
            teacher_id: normalizeText(req.body.teacher_id) || 'TBD'
        });
        return res.status(200).json({ "msg": "Added succesfully!!" });
    } catch (error) {
        console.log("Insert Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.updateSubject = async(req, res) => {
    // console.log("Inside Controller")
    const updatedSubj = req.body;
    // console.log("req body : ", updatedSubj);
    try {
        const updated = await Subject.findByIdAndUpdate(
            updatedSubj.id,
            {
                code: normalizeSubjectCode(updatedSubj.code),
                name: normalizeText(updatedSubj.name),
                course: canonicalCourse(updatedSubj.course) || normalizeLower(updatedSubj.course),
                branch: canonicalBranch(updatedSubj.branch) || normalizeText(updatedSubj.branch),
                semester: normalizeYearOrSemester(updatedSubj.semester),
                year: normalizeYearOrSemester(updatedSubj.year),
                teacher_id: normalizeText(updatedSubj.teacher_id) || 'TBD'
            },
            { new: true }
        );
        if (updated) {
            return res.status(200).json({ "msg": "Subject updated succesfully!" })
        }
        return res.status(203).json({ "msg": "Oops!! Try again!" });
    } catch (error) {
        console.log("Update Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.deleteSubject = async(req, res) => {
    console.log("Inside Controller", req.body)
    try {
        const deleted = await Subject.findByIdAndDelete(req.body.id);
        if (deleted) {
            return res.status(200).json({ "msg": "Subject deleted succesfully!" })
        }
        return res.status(203).json({ "msg": "Oops!! Try again!" });
    } catch (error) {
        console.log("Delete Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.getAllSubj = async(req, res) => {
    console.log("Inside Controller")
        // const { code } = req.body;
    console.log("req body : ", req.body);
    try {
        const subjects = await Subject.find({}).sort({ createdAt: -1 });
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.getStudentsByCourseAndyear = async(req, res) => {
    const { course, year, branch } = req.body;
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    try {
        const students = await Student.find({
            course: courseFilter(normalizedCourse),
            year: numericStringFilter(normalizedYear),
            branch: branchFilter(normalizedBranch)
        }).select('-password').sort({ roll: 1 });
        if (students.length > 0) {
            return res.status(200).json({ "data": students.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": students, "msg": "No students Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getAllTeachers = async(req, res) => {
    // console.log("Inside Controller")
    // const { course , year , branch } = req.body;
    // console.log("req body : ", req.body);
    try {
        const teachers = await Teacher.find({}).select('-password').sort({ createdAt: -1 });
        if (teachers.length > 0) {
            return res.status(200).json({ "data": teachers.map((t) => t.toJSON()) })
        }
        return res.status(203).json({ "res": teachers, "msg": "No proffesors Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getSubjByCourseAndyear = async(req, res) => {
    const { course, year, branch, semester } = req.body;
    const normalizedCourse = canonicalCourse(course) || normalizeLower(course);
    const normalizedYear = normalizeYearOrSemester(year);
    const normalizedBranch = canonicalBranch(branch) || normalizeText(branch);
    const normalizedSemester = normalizeYearOrSemester(semester);
    try {
        const query = {
            course: courseFilter(normalizedCourse),
            year: numericStringFilter(normalizedYear)
        };
        if (normalizedBranch) query.branch = branchFilter(normalizedBranch);
        if (normalizedSemester) query.semester = numericStringFilter(normalizedSemester);
        const subjects = await Subject.find(query).sort({ code: 1, name: 1 });
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
