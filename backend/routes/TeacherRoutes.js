const app = require('express');
const router = app.Router();
const {
    registerTeacher,
    loginTeacher,
    getSubjByYear: getSubjByCourse,
    getStudentsBySubject,
    takeAttendance,
    getAttendanceBySubject,
    updateAttendance,
    getTeacherDashboardSummary
} = require('../controllers/TeacherController');
const bodyParser = require('body-parser');
const Auth = require('../utils/Auth');


// console.log("Reg stud: ",registerStudent)
router.use(bodyParser.urlencoded({ extended: false }))
router.post('/registerTeacher',registerTeacher);
router.post('/loginTeacher',loginTeacher);
router.post('/getSubjByYear',getSubjByCourse);
router.post('/getStudentsBySubject',getStudentsBySubject);
router.post('/takeAttendance',takeAttendance);
router.post('/updateAttendance',updateAttendance);
router.post('/getAttendanceBySubject',getAttendanceBySubject);
router.post('/getTeacherDashboardSummary', getTeacherDashboardSummary);
module.exports=router;
