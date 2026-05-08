# CVM University Attendance Management System

A full-stack attendance management platform for colleges with role-based dashboards for **Students**, **Teachers**, and **Admin**.

This project lets teachers take attendance by course/year/semester/subject, students track subject-wise attendance with charts, and admins manage subjects, students, and faculty.

## ✨ Highlights

- **Role-based authentication** (`student`, `teacher`, `admin`)
- **Teacher dashboard** with branch-wise student attendance summary
- **Attendance flow**: `Course -> Year -> Semester -> Subject -> Students`
- **Teacher bulk student onboarding** via CSV upload with validation and duplicate checks
- **Student dashboard** with subject list and percentage summary
- **Student "My Attendance" page** with subject selector, chart, and full record table
- **Admin management** for subjects, students, teachers, and reports
- **JWT-based session flow** on frontend + backend
- **Real-time attendance tracking** with instant percentage calculations
- **Responsive UI** with Tailwind CSS + Material-UI components
- **Attendance analytics** with visual charts and statistics
- **CSV import with validation** - Smart duplicate detection and error reporting
- **Multi-semester support** - Organize students across courses, years, and semesters
- **Branch-wise organization** - Manage attendance by department/branch

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- MUI (Material-UI)
- Axios
- React Toastify
- react-minimal-pie-chart

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`

## 📁 Project Structure

```text
Student-Attendance-Management-System-main/
├── attendance/          # React frontend
├── backend/             # Node/Express backend
├── Screenshots/         # UI screenshots
└── README.md
```

## 🚀 Getting Started

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
JWT_EXPIRES_IN=12h
PORT=5000
NODE_ENV=development
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

## 📊 Seed Demo Data

From `backend/`:

```bash
npm run seed:subjects
npm run seed:students
```

These scripts generate normalized subjects/students across branches and semesters.

## 🔐 Default Admin Login

- Username: `admin`
- Password: `123456`

(Defined in `backend/controllers/AdminController.js`)

## 💡 Core User Flows

### 👨‍🎓 Student

- Login as student
- See only own course/year/semester/branch subjects on dashboard
- Open **My Attendance**
- Choose subject
- View:
  - Attendance percentage chart
  - Present/Absent/Leave count
  - Complete dated attendance table with filters

### 👨‍🏫 Teacher

- Login as teacher
- Dashboard shows branch-wise students and attendance percentage
- Open **Upload Students** to add students in bulk using CSV
- Go to **Take Attendance**
- Select `course -> year -> semester -> subject`
- Mark attendance and submit
- Dashboard percentages update for selected filters
- Track real-time attendance statistics

### 👨‍💼 Admin

- Manage subjects (Create, Read, Update, Delete)
- View and manage students
- View and manage teachers
- View attendance reports and analytics
- Monitor system-wide attendance trends

## 🔌 API Routes (Overview)

All routes are prefixed with `/api`.

### Student routes
- `POST /registerStudent` - Register a new student
- `POST /loginStudent` - Student login
- `POST /getSubjects` - Fetch student's subjects
- `POST /getattendance` - Get attendance records

### Teacher routes
- `POST /registerTeacher` - Register a new teacher
- `POST /loginTeacher` - Teacher login
- `POST /getSubjByYear` - Get subjects by year
- `POST /getStudentsBySubject` - Fetch students for a subject
- `POST /takeAttendance` - Mark attendance
- `POST /updateAttendance` - Update attendance records
- `POST /getAttendanceBySubject` - Get subject attendance summary
- `POST /getTeacherDashboardSummary` - Dashboard statistics
- `POST /uploadStudentsCsv` - Bulk student upload

### Admin routes
- `POST /loginAdmin` - Admin login
- `POST /addSubj` - Create subject
- `DELETE /deleteSubj` - Delete subject
- `POST /updateSubj` - Update subject
- `POST /getAllSubj` - List all subjects
- `POST /getStudentsCourseAndyear` - Get students by course/year
- `POST /getSubjByCourseAndyear` - Get subjects by course/year
- `POST /getTeachers` - List all teachers

## 📤 CSV Upload Feature (Teacher)

Teachers can upload students in bulk from the **Upload Students** page.

- UI route: `/uploadStudents`
- API route: `POST /api/uploadStudentsCsv`
- Auth: teacher JWT required

### Required CSV columns

- `name`
- `roll`

### Optional CSV columns

- `branch`
- `course`
- `year`
- `semester`
- `email`
- `contact`
- `password`

If optional fields are missing, backend applies defaults from teacher branch + selected defaults on UI.

### CSV header aliases supported

- `roll`: `roll`, `rollno`, `rollnumber`, `enrollment`, `enrollmentno`, `enrollmentnumber`
- `name`: `name`, `studentname`, `fullname`
- `semester`: `semester`, `sem`
- `branch`: `branch`, `department`, `dept`
- `contact`: `contact`, `contactno`, `contactnumber`, `phone`, `mobile`

### Validation and response

- Rejects empty CSV and CSV without data rows
- Rejects when required columns are missing
- Rejects duplicate roll numbers inside the same CSV
- Skips students already present in DB (based on roll)
- Returns comprehensive summary:
  - `totalRows` - Total rows processed
  - `insertedCount` - Successfully added students
  - `failedCount` - Failed entries
  - `duplicateCount` - Duplicate records detected
  - `failedRows` - Detailed error information with line numbers

## 📜 Scripts

### Backend (`backend/package.json`)

- `npm start` - run API server with nodemon
- `npm run seed:subjects` - seed subject records
- `npm run seed:students` - seed student records

### Frontend (`attendance/package.json`)

- `npm start` - run React app
- `npm run build` - production build
- `npm test` - run tests

## 🔒 Security Notes

- Never commit real database credentials or production secrets
- Rotate `SECRET_KEY` and DB password before deploying
- Use separate `.env` values for development and production
- Implement rate limiting on authentication endpoints
- Use HTTPS in production
- Keep dependencies updated regularly

## 📝 Known Notes

- Some older pages still contain ESLint warnings (mostly unused variables / loose equality), but the app builds and runs
- `backend/config/conn.js` includes a fallback Mongo URI. Prefer env-based URI and remove hardcoded fallback for production
- JWT tokens expire after 12 hours by default

## 🔮 Future Improvements

- ✅ Add refresh tokens and session expiry UI
- ✅ Add attendance export (CSV/PDF)
- ✅ Add per-subject class schedule and duplicate-check by lecture slot
- ✅ Add automated tests for auth + attendance flows
- ✅ Add email notifications for low attendance
- ✅ Implement role-based access control improvements
- ✅ Add attendance trends and predictive analytics
- ✅ Mobile app support
- ✅ Multi-language support

## 📄 License

This project is open source under the MIT License.
