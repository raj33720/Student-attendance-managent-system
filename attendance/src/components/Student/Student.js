import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import jwt_decode from "jwt-decode";
import { path } from '../../path'
import { useNavigate } from 'react-router-dom';

const axios = require('axios')

const Student = () => {
  const navigate = useNavigate();
  const [subjects, setsubjects] = useState([]);
  const [student, setStudent] = useState(null);
  const [summaryRows, setSummaryRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      setStudent(decoded);
      console.log("std: ", decoded);
    }
  }, []);

  useEffect(() => {
    if (!student) return;
    axios.post(`${path}/getSubjects`, {
      course: student.course,
      year: student.year,
      semester: student.semester,
      branch: student.branch
    })
      .then(function (response) {
        console.log("Res: ", response);
        if (response.status === 203) {
          setsubjects([]);
        }
        else {
          console.log("resp: ", response);
          const subjectList = response.data.data || [];
          const strictSemesterSubjects = subjectList.filter(
            (s) => String(s.semester) === String(student.semester)
          );
          setsubjects(strictSemesterSubjects.length ? strictSemesterSubjects : subjectList);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [student]);

  useEffect(() => {
    if (!student || subjects.length === 0) {
      setSummaryRows([]);
      return;
    }
    const fetchSummary = async () => {
      try {
        const rows = await Promise.all(
          subjects.map(async (s, idx) => {
            try {
              const res = await axios.post(`${path}/getattendance`, {
                roll: student.roll,
                subject: s.code,
                year: student.year,
                semester: student.semester
              });
              if (res.status === 203) {
                return {
                  id: s.id || s.code || idx,
                  code: s.code,
                  name: s.name,
                  conducted: 0,
                  present: 0,
                  absent: 0,
                  leave: 0,
                  percent: 0
                };
              }
              const records = res.data.data || [];
              let present = 0;
              let absent = 0;
              let leave = 0;
              records.forEach((r) => {
                if (r.status === 'present') present += 1;
                else if (r.status === 'absent') absent += 1;
                else leave += 1;
              });
              const total = present + absent + leave;
              const percent = total ? Math.round((present / (present + absent)) * 100) : 0;
              return {
                id: s.id || s.code || idx,
                code: s.code,
                name: s.name,
                conducted: total,
                present,
                absent,
                leave,
                percent
              };
            } catch (e) {
              console.log(e);
              return {
                id: s.id || s.code || idx,
                code: s.code,
                name: s.name,
                conducted: 0,
                present: 0,
                absent: 0,
                leave: 0,
                percent: 0
              };
            }
          })
        );
        setSummaryRows(rows);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSummary();
  }, [student, subjects]);
  return (
    <DashboardLayout>
      <section className="text-gray-600 body-font ">
        <div className="container px-5 py-10 mx-auto lg:w-[85%]">
          <div className="flex flex-col text-center w-full mb-12">
            <p className="uppercase tracking-[0.2em] text-xs text-emerald-600 font-semibold">Student Dashboard</p>
            <h1 className="section-title mt-2">Welcome <span className='text-blue-600'> {student?.name}</span></h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-slate-500 mt-2">Quick access to your subjects and attendance summary.</p>
          </div>
          <div className="flex flex-wrap -m-2 ">
            {
              subjects.map((s) => {
                return <div key={s.id || s._id || s.code} className="p-2 lg:w-1/3 md:w-1/2 w-full "   >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={()=>{
                      navigate('/subjattendance',{state:{
                        student: student ,
                        subject : s.name,
                        subCode: s.code
                      }})
                    }}
                  >
                    <div className="glass-panel card-hover h-full flex items-center hover:cursor-pointer p-4">
                      <img alt="team" className="w-14 h-14 bg-gray-100 object-cover object-center flex-shrink-0 rounded-2xl mr-4" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRAlBPmsRECoTvlQKFoT3uT5P9xGYGmaYkRM3lYpDGgMH4kLet6VLilfda76yIPRKq5_Q&usqp=CAU" />
                      <div className="flex-grow">
                        <p className="text-slate-500 text-sm">{s.code}</p>
                        <h2 className="text-slate-900 text-lg font-semibold">{s.name}</h2>
                      </div>
                    </div>
                  </button>
                </div>
              })
            }


          </div>
          <div className="mt-12 glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Attendance Summary</h2>
              <span className="subtle-text">Subject-wise view</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden">
                <thead className="table-head">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sr</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Conducted</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Present</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Absent</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Leave</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row, idx) => (
                    <tr key={row.id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.code} - {row.name}</td>
                      <td className="px-4 py-2 text-sm text-center">{row.conducted}</td>
                      <td className="px-4 py-2 text-sm text-center">{row.present}</td>
                      <td className="px-4 py-2 text-sm text-center">{row.absent}</td>
                      <td className="px-4 py-2 text-sm text-center">{row.leave}</td>
                      <td className="px-4 py-2 text-sm text-center font-semibold text-slate-900">{row.percent}%</td>
                    </tr>
                  ))}
                  {summaryRows.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan="7">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default Student
