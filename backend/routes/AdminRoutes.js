const app = require('express');
const router = app.Router();
const { loginAdmin, addSubject, getAllSubj, getSubjByCourseAndyear, updateSubject, deleteSubject, getStudentsByCourseAndyear, getAllTeachers } = require('../controllers/AdminController');
const bodyParser = require('body-parser');
const Auth = require('../utils/Auth');


// console.log("Reg stud: ",registerStudent)
router.use(bodyParser.urlencoded({ extended: false }))
router.post('/loginAdmin', loginAdmin);
router.post('/addSubj', Auth(['admin']), addSubject);
router.delete('/deleteSubj', Auth(['admin']), deleteSubject);
router.post('/updateSubj', Auth(['admin']), updateSubject);
router.post('/getAllSubj', Auth(['admin']), getAllSubj);
router.post('/getStudentsCourseAndyear', Auth(['admin']), getStudentsByCourseAndyear);
router.post('/getSubjByCourseAndyear', Auth(['admin']), getSubjByCourseAndyear);
router.post('/getTeachers', Auth(['admin']), getAllTeachers);
module.exports = router;
