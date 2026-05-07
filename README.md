# CVM University Attendance Management System

A full-stack attendance management platform for colleges with role-based dashboards for **Students**, **Teachers**, and **Admin**.

This project lets teachers take attendance by course/year/semester/subject, students track subject-wise attendance with charts, and admins manage subjects, students, and faculty.

## Highlights

- Role-based authentication (`student`, `teacher`, `admin`)
- Teacher dashboard with branch-wise student attendance summary
- Attendance flow: `Course -> Year -> Semester -> Subject -> Students`
- Student dashboard with subject list and percentage summary
- Student "My Attendance" page with subject selector, chart, and full record table
- Admin management for subjects, students, teachers, and reports
- JWT-based session flow on frontend + backend

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- MUI
- Axios
- React Toastify
- react-minimal-pie-chart

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`

## Project Structure

```text
Student-Attendance-Management-System-main/
|- attendance/          # React frontend
|- backend/             # Node/Express backend
|- Screenshots/         # UI screenshots
|- README.md
```

## Getting Started

### 1) Prerequisites

- Node.js 18+ recommended
- npm 9+
- MongoDB Atlas or local MongoDB

### 2) Clone and install

```bash
git clone <your-repo-url>
cd Student-Attendance-Management-System-main
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../attendance
npm install
```

### 3) Environment setup

Create/update `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secure_jwt_secret
PORT=5000
```

Create/update `attendance/.env` (optional, recommended):

```env
REACT_APP_API_URL=http://127.0.0.1:5000/api
```

### 4) Run the app

Start backend:

```bash
cd backend
npm start
```

Start frontend (new terminal):

```bash
cd attendance
npm start
```

Frontend runs on `http://localhost:3000` and backend on `http://127.0.0.1:5000` by default.

## Seed Demo Data

From `backend/`:

```bash
npm run seed:subjects
npm run seed:students
```

These scripts generate normalized subjects/students across branches and semesters.

## Default Admin Login

- Username: `admin`
- Password: `admin`

(Defined in `backend/controllers/AdminController.js`)

## Core User Flows

### Student

- Login as student
- See only own course/year/semester/branch subjects on dashboard
- Open **My Attendance**
- Choose subject
- View:
  - attendance percentage chart
  - present/absent/leave count
  - complete dated attendance table

### Teacher

- Login as teacher
- Dashboard shows branch-wise students and attendance percentage
- Go to **Take Attendance**
- Select `course -> year -> semester -> subject`
- Mark attendance and submit
- Dashboard percentages update for selected filters

### Admin

- Manage subjects
- View students and teachers
- View attendance reports

## API Routes (Overview)

All routes are prefixed with `/api`.

### Student routes
- `POST /registerStudent`
- `POST /loginStudent`
- `POST /getSubjects`
- `POST /getattendance`

### Teacher routes
- `POST /registerTeacher`
- `POST /loginTeacher`
- `POST /getSubjByYear`
- `POST /getStudentsBySubject`
- `POST /takeAttendance`
- `POST /updateAttendance`
- `POST /getAttendanceBySubject`
- `POST /getTeacherDashboardSummary`

### Admin routes
- `POST /loginAdmin`
- `POST /addSubj`
- `DELETE /deleteSubj`
- `POST /updateSubj`
- `POST /getAllSubj`
- `POST /getStudentsCourseAndyear`
- `POST /getSubjByCourseAndyear`
- `POST /getTeachers`

## Scripts

### Backend (`backend/package.json`)

- `npm start` - run API server with nodemon
- `npm run seed:subjects` - seed subject records
- `npm run seed:students` - seed student records

### Frontend (`attendance/package.json`)

- `npm start` - run React app
- `npm run build` - production build
- `npm test` - run tests

## Screenshots

Available inside `Screenshots/`:
- `Login.png`
- `Teacher Dashboard.png`
- `Take attendance.png`
- `Student Dashboard.png`
- `Student Attendance View.png`
- `Subjects admin.png`

## Security Notes

- Never commit real database credentials or production secrets.
- Rotate `SECRET_KEY` and DB password before deploying.
- Use separate `.env` values for development and production.

## Known Notes

- Some older pages still contain ESLint warnings (mostly unused variables / loose equality), but the app builds and runs.
- `backend/config/conn.js` includes a fallback Mongo URI. Prefer env-based URI and remove hardcoded fallback for production.

## Future Improvements

- Add refresh tokens and session expiry UI
- Add attendance export (CSV/PDF)
- Add per-subject class schedule and duplicate-check by lecture slot
- Add automated tests for auth + attendance flows

## License

This project is open source under the MIT License.
# Student-attendance-managent-system
