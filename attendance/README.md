# Attendance Frontend

Frontend app for the CVM University Attendance Management System.

For full project documentation (backend + frontend + setup), see the root README:

- `../README.md`

## Features in Frontend

- Role-based login flow (student, teacher, admin entry points)
- Protected routes using JWT session
- Teacher dashboard with attendance summary
- Teacher attendance marking flow
- Teacher bulk student upload using CSV (`/uploadStudents`)
- Student attendance views with chart and detailed records
- Admin views for students, professors, and attendance

## Local Development

```bash
cd attendance
npm install
npm start
```

App runs on `http://localhost:3000`.

## Environment

Create `attendance/.env`:

```env
REACT_APP_API_URL=http://127.0.0.1:5000/api
```
