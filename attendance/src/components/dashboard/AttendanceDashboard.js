import React, { useState, useEffect, useCallback } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { path } from '../../path'

const axios = require('axios')

const COURSE_OPTIONS_BY_BRANCH = {
  CSE: ['btech', 'mtech'],
  ECE: ['btech', 'mtech'],
  EEE: ['btech'],
  ME: ['btech'],
  CE: ['btech']
}

const YEARS_BY_COURSE = {
  btech: ['1', '2', '3', '4'],
  mtech: ['1', '2']
}

const SEMESTERS_BY_COURSE = {
  btech: ['1', '2', '3', '4', '5', '6', '7', '8'],
  mtech: ['1', '2', '3', '4']
}

const AttendanceDashboard = () => {
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [subject, setSubject] = useState('')
  const [subjects, setSubjects] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const teacherBranch = teacher?.branch || ''
  const courseOptions = COURSE_OPTIONS_BY_BRANCH[teacherBranch] || ['btech']

  const decodeTeacher = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const decoded = jwt_decode(token)
      setTeacher(decoded)
      const defaultCourse = (COURSE_OPTIONS_BY_BRANCH[decoded?.branch] || ['btech'])[0]
      setCourse(defaultCourse)
    } catch (error) {
      console.log('Token decode error: ', error)
      setTeacher(null)
    }
  }, [])

  const loadSubjects = useCallback(async () => {
    if (!teacherBranch || !course || !year || !semester) {
      setSubjects([])
      setSubject('')
      return
    }

    try {
      const res = await axios.post(`${path}/getSubjByYear`, {
        teacher_id: teacher?.id || '',
        course,
        year,
        semester,
        branch: teacherBranch
      })
      if (res.status === 200) {
        setSubjects(res.data.data || [])
      } else {
        setSubjects([])
        setSubject('')
      }
    } catch (error) {
      console.log(error)
      setSubjects([])
      setSubject('')
    }
  }, [teacher?.id, teacherBranch, course, year, semester])

  const loadDashboard = useCallback(async () => {
    if (!teacherBranch) return
    setLoading(true)
    try {
      const payload = {
        branch: teacherBranch,
        course,
        year,
        semester,
        subject
      }
      const res = await axios.post(`${path}/getTeacherDashboardSummary`, payload)
      if (res.status === 200) {
        setRows(res.data.data || [])
      } else {
        setRows([])
      }
    } catch (error) {
      console.log(error)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [teacherBranch, course, year, semester, subject])

  useEffect(() => {
    decodeTeacher()
  }, [decodeTeacher])

  useEffect(() => {
    setYear('')
    setSemester('')
    setSubject('')
    setSubjects([])
  }, [course])

  useEffect(() => {
    setSemester('')
    setSubject('')
    setSubjects([])
  }, [year])

  useEffect(() => {
    setSubject('')
    loadSubjects()
  }, [loadSubjects])

  useEffect(() => {
    if (teacherBranch) {
      loadDashboard()
    }
  }, [teacherBranch, loadDashboard])

  const handleTakeAttendance = () => {
    navigate('/takeAttendance', {
      state: {
        course,
        year,
        semester,
        subject
      }
    })
  }

  const totalStudents = rows.length
  const avgAttendance = totalStudents
    ? (rows.reduce((acc, item) => acc + item.percentage, 0) / totalStudents).toFixed(2)
    : '0.00'

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[180px] flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Branch</label>
            <input
              type="text"
              value={teacherBranch || 'Not available'}
              readOnly
              className="w-full px-4 py-2 rounded-xl border bg-gray-100"
            />
          </div>

          <div className="min-w-[160px] flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            >
              <option value="">Select Course</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[140px] flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            >
              <option value="">All Years</option>
              {(YEARS_BY_COURSE[course] || []).map((y) => (
                <option key={y} value={y}>{`Year ${y}`}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px] flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            >
              <option value="">All Semesters</option>
              {(SEMESTERS_BY_COURSE[course] || []).map((s) => (
                <option key={s} value={s}>{`Sem ${s}`}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[220px] flex-1">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id || s.code} value={s.code}>{`${s.code} - ${s.name}`}</option>
              ))}
            </select>
          </div>

          <button onClick={loadDashboard} className="primary-btn" type="button">Load Students</button>
          <button onClick={handleTakeAttendance} className="ghost-btn" type="button">Take Attendance</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-gray-500">Average Attendance %</p>
          <p className="text-2xl font-bold text-emerald-700">{avgAttendance}%</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-gray-500">Current Scope</p>
          <p className="text-sm font-semibold text-slate-900">
            {`${teacherBranch || '-'} ${course ? `| ${course.toUpperCase()}` : ''} ${year ? `| Year ${year}` : ''} ${semester ? `| Sem ${semester}` : ''}`}
          </p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-4">Student Attendance Percentage</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-2 text-left">Roll</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-center">Course</th>
                <th className="px-4 py-2 text-center">Year</th>
                <th className="px-4 py-2 text-center">Semester</th>
                <th className="px-4 py-2 text-center">Present</th>
                <th className="px-4 py-2 text-center">Absent</th>
                <th className="px-4 py-2 text-center">Leave</th>
                <th className="px-4 py-2 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.roll} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-2 text-sm">{row.roll}</td>
                  <td className="px-4 py-2 text-sm font-medium">{row.name}</td>
                  <td className="px-4 py-2 text-sm text-center">{row.course || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center">{row.year || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center">{row.semester || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center">{row.present}</td>
                  <td className="px-4 py-2 text-sm text-center">{row.absent}</td>
                  <td className="px-4 py-2 text-sm text-center">{row.leave}</td>
                  <td className="px-4 py-2 text-sm text-center font-semibold text-slate-900">{row.percentage}%</td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-sm text-gray-500">No students found for selected filters.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-sm text-gray-500">Loading students...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AttendanceDashboard
