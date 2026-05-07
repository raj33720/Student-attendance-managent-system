import './App.css';
import Login from './components/LandingPage/Login';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import SignupStudent from './components/LandingPage/SignupStudent';
import SignupTeacher from './components/LandingPage/signupTeacher';
import Teacher from './components/Teacher/Teacher';
import Student from './components/Student/Student';
import Admin from './components/Admin/Admin';
import AdminLogin from './components/Admin/Login';
import ViewSubjs from './components/Subjects/ViewSubjs';
import TakeAttendance from './components/Teacher/TakeAttendance';
import ViewAttendance from './components/Teacher/ViewAttendance';
import SubjAttend from './components/Student/SubjAttend';
import ViewAttendanceAdm from './components/Admin/ViewAttendance';
import ViewStudAtten from './components/Teacher/ViewStudAtten';
import ViewSubjAttendance from './components/Admin/ViewSubjAttendance';
import ViewStudents from './components/Admin/ViewStudents';
import ViewProffessors from './components/Admin/ViewProfessors';
import ProtectedRoute from './components/routing/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/registerStudent" element={<SignupStudent />} />
          <Route path="/registerTeacher" element={ <SignupTeacher /> }></Route>
          <Route path="/adminLogin" element={<AdminLogin />} />

          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/takeAttendance" element={<TakeAttendance />} />
            <Route path="/viewAttendance" element={<ViewAttendance />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<Student />} />
            <Route path="/subjattendance" element={<SubjAttend />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/viewSubjs" element={<ViewSubjs />} />
            <Route path="/viewAttendAdm" element={<ViewAttendanceAdm />} />
            <Route path="/viewSubjectAttend" element={<ViewSubjAttendance />} />
            <Route path="/viewStudents" element={<ViewStudents />} />
            <Route path="/viewProff" element={<ViewProffessors />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
            <Route path="/viewStudAtten" element={<ViewStudAtten />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
