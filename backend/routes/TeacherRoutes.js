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
router.post('/getSubjByYear',Auth(['teacher', 'admin']),getSubjByCourse);
router.post('/getStudentsBySubject',Auth(['teacher', 'admin']),getStudentsBySubject);
router.post('/takeAttendance',Auth(['teacher']),takeAttendance);
router.post('/updateAttendance',Auth(['teacher', 'admin']),updateAttendance);
router.post('/getAttendanceBySubject',Auth(['teacher', 'admin']),getAttendanceBySubject);
router.post('/getTeacherDashboardSummary',Auth(['teacher', 'admin']), getTeacherDashboardSummary);
module.exports=router;
