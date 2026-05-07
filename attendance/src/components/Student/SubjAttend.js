import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path';
import { PieChart } from 'react-minimal-pie-chart';
import jwt_decode from 'jwt-decode';

const axios = require('axios');

const initialSummary = {
  beginDate: '-',
  endDate: '-',
  present: 0,
  absent: 0,
  leave: 0,
  percent: 0,
  pieData: []
};

const defaultLabelStyle = {
  fontSize: '5px',
  fontFamily: 'sans-serif'
};

const SubjAttend = () => {
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedCode, setSelectedCode] = useState(location.state?.subCode || '');
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.code === selectedCode) || null,
    [subjects, selectedCode]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');

    if (!token || type !== 'student') {
      return;
    }

    try {
      const decoded = jwt_decode(token);
      setStudent(decoded);
    } catch (error) {
      console.log('Student token decode error: ', error);
    }
  }, []);

  const loadSubjects = useCallback(async () => {
    if (!student) return;

    setLoadingSubjects(true);
    try {
      const response = await axios.post(`${path}/getSubjects`, {
        course: student.course,
        year: student.year,
        semester: student.semester,
        branch: student.branch
      });

      if (response.status === 200) {
        const subjectList = response.data.data || [];

        // Strictly keep current-semester subjects for student dashboard flow.
        const strictSemesterSubjects = subjectList.filter(
          (s) => String(s.semester) === String(student.semester)
        );
        const finalSubjects = strictSemesterSubjects.length ? strictSemesterSubjects : subjectList;

        setSubjects(finalSubjects);

        if (finalSubjects.length === 0) {
          setSelectedCode('');
          return;
        }

        if (selectedCode && finalSubjects.some((s) => s.code === selectedCode)) {
          return;
        }

        setSelectedCode(finalSubjects[0].code);
      } else {
        setSubjects([]);
        setSelectedCode('');
      }
    } catch (error) {
      console.log(error);
      setSubjects([]);
      setSelectedCode('');
    } finally {
      setLoadingSubjects(false);
    }
  }, [student, selectedCode]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const loadAttendance = useCallback(async () => {
    if (!student || !selectedCode) {
      setAttendance([]);
      setSummary(initialSummary);
      return;
    }

    setLoadingAttendance(true);
    try {
      const response = await axios.post(`${path}/getattendance`, {
        roll: student.roll,
        subject: selectedCode,
        year: student.year,
        semester: student.semester
      });

      if (response.status !== 200) {
        setAttendance([]);
        setSummary(initialSummary);
        return;
      }

      const records = response.data.data || [];
      setAttendance(records);

      if (!records.length) {
        setSummary(initialSummary);
        return;
      }

      let present = 0;
      let absent = 0;
      let leave = 0;

      records.forEach((entry) => {
        if (entry.status === 'present') present += 1;
        else if (entry.status === 'absent') absent += 1;
        else leave += 1;
      });

      const pieData = [];
      if (present > 0) pieData.push({ title: 'Present', value: present, color: '#21a66e' });
      if (absent > 0) pieData.push({ title: 'Absent', value: absent, color: '#f87171' });
      if (leave > 0) pieData.push({ title: 'Leave', value: leave, color: '#f59e0b' });

      const beginDate = new Date(records[records.length - 1].date).toLocaleDateString('en-GB');
      const endDate = new Date(records[0].date).toLocaleDateString('en-GB');
      const percent = present + absent > 0 ? Math.round((present / (present + absent)) * 100) : 0;

      setSummary({
        beginDate,
        endDate,
        present,
        absent,
        leave,
        percent,
        pieData
      });
    } catch (error) {
      console.log(error);
      toast.error('Failed to load attendance records.');
      setAttendance([]);
      setSummary(initialSummary);
    } finally {
      setLoadingAttendance(false);
    }
  }, [student, selectedCode]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  return (
    <DashboardLayout>
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

      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold">My Attendance</h1>
        </div>

        <div className="glass-panel p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Student</label>
              <input
                value={student ? `${student.name} (${student.roll})` : ''}
                readOnly
                className="w-full px-4 py-2 rounded-xl border bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Subject</label>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border"
                disabled={loadingSubjects || subjects.length === 0}
              >
                {subjects.length === 0 && <option value="">No Subject Found</option>}
                {subjects.map((s) => (
                  <option key={s.id || s.code} value={s.code}>{`${s.code} - ${s.name}`}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              <div><span className="font-semibold">Course:</span> {student?.course || '-'}</div>
              <div><span className="font-semibold">Branch:</span> {student?.branch || '-'}</div>
              <div><span className="font-semibold">Year/Sem:</span> {student?.year || '-'} / {student?.semester || '-'}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-3 text-sm text-gray-700">
            <div><span className="font-semibold">Subject:</span> {selectedSubject?.name || '-'}</div>
            <div><span className="font-semibold">Total Working Days:</span> {attendance.length}</div>
            <div><span className="font-semibold">Date:</span> {summary.beginDate} to {summary.endDate}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="glass-panel p-4">
              {loadingAttendance ? (
                <div className="h-[220px] flex items-center justify-center text-gray-500">Loading chart...</div>
              ) : summary.pieData.length > 0 ? (
                <PieChart
                  data={summary.pieData}
                  segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                  animate={true}
                  label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                  labelStyle={defaultLabelStyle}
                  animationDuration={1200}
                  radius={35}
                  viewBoxSize={[100, 100]}
                />
              ) : (
                <div className="h-[220px] flex items-center justify-center text-gray-500">No attendance data for this subject</div>
              )}
            </div>
          </div>
          <div className="glass-panel p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#21a66e]"></div><div>Present: {summary.present}</div></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#f87171]"></div><div>Absent: {summary.absent}</div></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#f59e0b]"></div><div>Leave: {summary.leave}</div></div>
            <div className="mt-2 font-semibold">Attendance (%): {summary.percent}%</div>
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Sr</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((entry, index) => (
                  <tr key={entry.id || entry._id || `${entry.roll}-${entry.date}`} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-center">{index + 1}</td>
                    <td className="px-6 py-3 text-center">{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-3 text-center capitalize">{entry.status}</td>
                  </tr>
                ))}
                {!loadingAttendance && attendance.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-6 text-center text-sm text-gray-500">No attendance records found</td>
                  </tr>
                )}
                {loadingAttendance && (
                  <tr>
                    <td colSpan="3" className="px-6 py-6 text-center text-sm text-gray-500">Loading attendance records...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubjAttend;
