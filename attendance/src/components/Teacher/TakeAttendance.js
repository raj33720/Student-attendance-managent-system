import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../header/Header'
import { ToastContainer, toast } from 'react-toastify'
import { path } from '../../path'
import jwt_decode from 'jwt-decode'

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

const TakeAttendance = () => {
  const location = useLocation()

  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [subject, setSubject] = useState('')
  const [teacher, setTeacher] = useState(null)
  const [attendanceMap, setAttendanceMap] = useState({})
  const [showRecord, setShowRecord] = useState(false)
  const [counts, setCounts] = useState({ present: 0, absent: 0, leave: 0 })
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().slice(0, 10))

  const teacherBranch = teacher?.branch || ''
  const courseOptions = COURSE_OPTIONS_BY_BRANCH[teacherBranch] || ['btech']

  const applyPrefill = useCallback((decodedTeacher) => {
    const prefill = location.state || {}
    const allowedCourses = COURSE_OPTIONS_BY_BRANCH[decodedTeacher?.branch] || ['btech']
    const initialCourse = prefill.course && allowedCourses.includes(prefill.course)
      ? prefill.course
      : (COURSE_OPTIONS_BY_BRANCH[decodedTeacher?.branch] || ['btech'])[0]

    setCourse(initialCourse || '')
    setYear(prefill.year || '')
    setSemester(prefill.semester || '')
    setSubject(prefill.subject || '')
  }, [location.state])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const decoded = jwt_decode(token)
      setTeacher(decoded)
      applyPrefill(decoded)
    } catch (error) {
      console.log('Token decode error: ', error)
      setTeacher(null)
    }
  }, [applyPrefill])

  const resetStudentSelection = () => {
    setStudents([])
    setAttendanceMap({})
    setCounts({ present: 0, absent: 0, leave: 0 })
    setShowRecord(false)
  }

  const getSubjList = useCallback(async () => {
    if (!course || !year || !semester || !teacherBranch) {
      setSubjects([])
      return
    }

    try {
      const response = await axios.post(`${path}/getSubjByYear`, {
        course,
        year,
        semester,
        branch: teacherBranch,
        teacher_id: teacher?.id || ''
      })

      if (response.status === 200) {
        setSubjects(response.data.data || [])
      } else {
        toast.warn(response?.data?.msg || 'No subjects found for this class.')
        setSubjects([])
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Failed to load subjects.')
      console.log(error)
      setSubjects([])
    }
  }, [course, year, semester, teacherBranch, teacher?.id])

  useEffect(() => {
    getSubjList()
  }, [getSubjList])

  const getStudents = useCallback(async () => {
    const selectedSubj = subjects.find((s) => s.code === subject)
    if (!selectedSubj) return

    try {
      const response = await axios.post(`${path}/getStudentsBySubject`, {
        course: selectedSubj.course,
        year: selectedSubj.year,
        semester: selectedSubj.semester,
        branch: teacherBranch
      })

      if (response.status === 200) {
        const data = response.data.data || []
        const defaults = {}
        data.forEach((student) => {
          defaults[student.roll] = 'absent'
        })
        setStudents(data)
        setAttendanceMap(defaults)
      } else {
        toast.warn(response?.data?.msg || 'No students found for selected subject.')
        resetStudentSelection()
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Failed to load students.')
      console.log(error)
      resetStudentSelection()
    }
  }, [subject, subjects, teacherBranch])

  useEffect(() => {
    if (subject) {
      getStudents()
    }
  }, [subject, getStudents])

  const setStatusForRoll = (roll, status) => {
    setAttendanceMap((prev) => ({ ...prev, [roll]: status }))
  }

  const markAll = (status) => {
    const next = {}
    students.forEach((student) => {
      next[student.roll] = status
    })
    setAttendanceMap(next)
  }

  const handleAttendanceSubmit = async () => {
    const selectedSubj = subjects.find((s) => s.code === subject)
    if (!selectedSubj) {
      toast.warn('Please select a valid subject.')
      return
    }
    if (!attendanceDate) {
      toast.warn('Please select attendance date.')
      return
    }
    if (!students.length) {
      toast.warn('No students found to mark attendance.')
      return
    }

    const attendance = students.map((student) => ({
      roll: student.roll,
      status: attendanceMap[student.roll] || 'absent'
    }))

    try {
      const response = await axios.post(`${path}/takeAttendance`, {
        subject: selectedSubj.code,
        course: selectedSubj.course,
        branch: teacherBranch,
        year: selectedSubj.year,
        semester: selectedSubj.semester,
        attendance,
        date: attendanceDate
      })

      if (response.status !== 200) {
        toast.error(response?.data?.msg || 'Unable to record attendance.')
        return
      }

      const present = attendance.filter((a) => a.status === 'present').length
      const absent = attendance.filter((a) => a.status === 'absent').length
      const leave = attendance.filter((a) => a.status === 'leave').length

      setCounts({ present, absent, leave })
      setShowRecord(true)
      toast.success(response?.data?.msg || 'Attendance recorded successfully.')
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Failed to record attendance.')
      console.log(error)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />

      <div className="container mx-auto">
        <div className="flex justify-center px-6">
          <div className="w-[80%]">
            <div className="glass-panel p-6">
              <h3 className="pt-2 text-2xl text-center font-semibold">Take Attendance</h3>
              <form className="px-6 pt-6 pb-4">
                <div className="mb-4 md:flex md:justify-between gap-4">
                  <div className="mb-4 md:mb-0 w-full md:w-1/4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 text-left" htmlFor="course">Course</label>
                    <select
                      id="course"
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value)
                        setYear('')
                        setSemester('')
                        setSubject('')
                        setSubjects([])
                        resetStudentSelection()
                      }}
                      className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm"
                      required
                    >
                      <option value="">Select Course</option>
                      {courseOptions.map((c) => (
                        <option key={c} value={c}>{c.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 md:mb-0 w-full md:w-1/4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 text-left" htmlFor="branch">Branch</label>
                    <input
                      id="branch"
                      type="text"
                      value={teacherBranch || 'Not available'}
                      readOnly
                      className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm bg-gray-100"
                    />
                  </div>

                  <div className="mb-4 md:mb-0 w-full md:w-1/4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 text-left" htmlFor="year">Year</label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value)
                        setSemester('')
                        setSubject('')
                        setSubjects([])
                        resetStudentSelection()
                      }}
                      className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm"
                      required
                    >
                      <option value="">Select Year</option>
                      {(YEARS_BY_COURSE[course] || []).map((y) => (
                        <option key={y} value={y}>{`Year ${y}`}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 md:mb-0 w-full md:w-1/4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 text-left" htmlFor="semester">Semester</label>
                    <select
                      id="semester"
                      value={semester}
                      onChange={(e) => {
                        setSemester(e.target.value)
                        setSubject('')
                        resetStudentSelection()
                      }}
                      className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm"
                      required
                    >
                      <option value="">Select Semester</option>
                      {(SEMESTERS_BY_COURSE[course] || []).map((s) => (
                        <option key={s} value={s}>{`Sem ${s}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4 md:flex md:justify-between gap-4">
                  <div className="mb-4 md:mb-0 w-full md:w-2/3">
                    <label className="block mb-2 text-sm font-bold text-gray-700 text-left" htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value)
                        resetStudentSelection()
                      }}
                      className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.id || s.code} value={s.code}>{`${s.code} - ${s.name}`}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 md:mb-0 w-full md:w-1/3">
                    <label className="block mb-2 text-sm font-bold text-gray-700 text-left" htmlFor="attendanceDate">Attendance Date</label>
                    <input
                      id="attendanceDate"
                      type="date"
                      value={attendanceDate}
                      max={today}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="container mx-auto xl:w-[80%] mt-6">
          <div className="flex justify-center px-6">
            <div className="md:w-[100%]">
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold">Attendance List</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => markAll('present')} className="ghost-btn">Mark All Present</button>
                    <button type="button" onClick={() => markAll('absent')} className="ghost-btn">Mark All Absent</button>
                  </div>
                </div>

                <form className="px-2 pt-2 pb-4">
                  {students.map((student) => (
                    <div key={student.id || student.roll}>
                      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="md:w-1/2 text-left">
                          <span className="font-semibold">{student.roll}</span>
                          <span className="ml-2">{student.name}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 md:w-1/2 md:justify-end">
                          {['present', 'absent', 'leave'].map((status) => (
                            <label key={`${student.roll}-${status}`} className="flex items-center gap-2 text-sm capitalize">
                              <input
                                type="radio"
                                name={`attendance-${student.roll}`}
                                value={status}
                                checked={(attendanceMap[student.roll] || 'absent') === status}
                                onChange={(e) => setStatusForRoll(student.roll, e.target.value)}
                              />
                              {status}
                            </label>
                          ))}
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}

                  <div className="mt-6 text-center">
                    <button onClick={handleAttendanceSubmit} className="primary-btn" type="button">Submit Attendance</button>
                  </div>

                  {showRecord && (
                    <div className="mt-4 text-center">
                      <h2 className="font-semibold">Attendance recorded successfully</h2>
                      <h2>{`Present: ${counts.present} | Absent: ${counts.absent} | Leave: ${counts.leave}`}</h2>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TakeAttendance
