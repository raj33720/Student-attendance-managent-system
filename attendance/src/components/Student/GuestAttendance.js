import React, { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { path } from '../../path';
const axios = require('axios');

const defaultLabelStyle = {
  fontSize: '6px',
  fontFamily: 'sans-serif'
};

const GuestAttendance = ({ onClose }) => {
  const [roll, setRoll] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, leave: 0, percent: 0, pieData: [] });

  const handleLookup = async () => {
    if (!roll.trim()) {
      alert('Please enter roll number');
      return;
    }
    setLoading(true);
    try {
      const payload = { roll: roll.trim() };
      if (subject.trim()) payload.subject = subject.trim();
      const res = await axios.post(`${path}/getattendance`, payload);
      if (res.status === 203) {
        alert(res.data.msg || 'No records found');
        setRecords([]);
        setSummary({ present: 0, absent: 0, leave: 0, percent: 0, pieData: [] });
      } else {
        const data = res.data.data || [];
        setRecords(data);
        let present = 0, absent = 0, leave = 0;
        data.forEach((r) => {
          if (r.status === 'present') present += 1;
          else if (r.status === 'absent') absent += 1;
          else leave += 1;
        });
        const percent = present + absent > 0 ? Math.round((present / (present + absent)) * 100) : 0;
        const pieData = [];
        if (present > 0) pieData.push({ title: 'Present', value: present, color: '#21a66e' });
        if (absent > 0) pieData.push({ title: 'Absent', value: absent, color: '#f87171' });
        if (leave > 0) pieData.push({ title: 'Leave', value: leave, color: '#f59e0b' });
        setSummary({ present, absent, leave, percent, pieData });
      }
    } catch (e) {
      console.error(e);
      alert('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-xl shadow-lg p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Attendance Lookup</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input value={roll} onChange={(e)=>setRoll(e.target.value)} placeholder="Roll number" className="border px-3 py-2 rounded" />
          <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject code (optional)" className="border px-3 py-2 rounded" />
          <div className="flex items-center">
            <button onClick={handleLookup} disabled={loading} className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded">
              {loading ? 'Looking...' : 'Lookup'}
            </button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 glass-panel p-4">
              <div className="mb-2 font-semibold">Attendance Records ({records.length})</div>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-2 text-sm text-gray-600">Sr</th>
                      <th className="px-4 py-2 text-sm text-gray-600">Date</th>
                      <th className="px-4 py-2 text-sm text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, idx) => (
                      <tr key={r.id || r._id || idx} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-center">{idx+1}</td>
                        <td className="px-4 py-2 text-center">{new Date(r.date).toLocaleDateString('en-GB')}</td>
                        <td className="px-4 py-2 text-center capitalize">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel p-4 flex flex-col gap-3">
              <div className="text-sm text-gray-600">Summary</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#21a66e]"></div><div>Present: {summary.present}</div></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#f87171]"></div><div>Absent: {summary.absent}</div></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#f59e0b]"></div><div>Leave: {summary.leave}</div></div>
              <div className="font-semibold">Attendance (%): {summary.percent}%</div>
              {summary.pieData.length > 0 && (
                <div className="mt-2">
                  <PieChart data={summary.pieData} animate label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'} labelStyle={defaultLabelStyle} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestAttendance;
