import React, { useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import DashboardLayout from '../layout/DashboardLayout';
import { getAuthSession } from '../../utils/auth';
import { path } from '../../path';

const axios = require('axios');

const UploadStudentsCsv = () => {
  const { user } = getAuthSession();
  const teacherBranch = user?.branch || '';

  const [csvFile, setCsvFile] = useState(null);
  const [course, setCourse] = useState('btech');
  const [year, setYear] = useState('1');
  const [semester, setSemester] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sampleHeader = useMemo(
    () => 'name,roll,branch,course,year,semester,email,contact,password',
    []
  );

  const handleUpload = async () => {
    if (!csvFile) {
      toast.warn('Please choose a CSV file first.');
      return;
    }

    try {
      setLoading(true);
      const csvContent = await csvFile.text();
      if (!csvContent.trim()) {
        toast.warn('Selected CSV file is empty.');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${path}/uploadStudentsCsv`, {
        csvContent,
        defaultCourse: course,
        defaultYear: year,
        defaultSemester: semester,
        defaultBranch: teacherBranch
      });

      setResult(response.data);
      toast.success(response.data.msg || 'CSV uploaded successfully.');
    } catch (error) {
      const msg = error?.response?.data?.msg || 'CSV upload failed.';
      toast.error(msg);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={2200} />
      <section className="space-y-6">
        <div className="glass-panel p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Upload Students CSV</h2>
          {/* <p className="mt-2 text-sm text-slate-600">
            This feature is available only in Teacher section. You can upload a CSV to add students in bulk.
          </p> */}
          <p className="mt-2 text-sm text-slate-600">
            Required CSV columns: <span className="font-semibold">name, roll</span>. Other fields can come from defaults below.
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Teacher Branch</label>
              <input
                type="text"
                value={teacherBranch || 'Not found in token'}
                readOnly
                className="w-full px-4 py-2 rounded-xl border bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Default Course</label>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-2 rounded-xl border">
                <option value="btech">BTECH</option>
                <option value="mtech">MTECH</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Default Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-4 py-2 rounded-xl border">
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Default Semester</label>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full px-4 py-2 rounded-xl border">
                <option value="1">Sem 1</option>
                <option value="2">Sem 2</option>
                <option value="3">Sem 3</option>
                <option value="4">Sem 4</option>
                <option value="5">Sem 5</option>
                <option value="6">Sem 6</option>
                <option value="7">Sem 7</option>
                <option value="8">Sem 8</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="block w-full md:w-auto text-sm text-gray-700"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="primary-btn md:w-auto"
            >
              {loading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold">CSV Header Format</h3>
          <pre className="mt-3 bg-slate-50 border rounded-lg p-3 text-sm overflow-x-auto">{sampleHeader}</pre>
          <p className="mt-2 text-sm text-slate-600">
            Optional columns: email, contact, password. If missing, backend uses safe defaults.
          </p>
        </div>

        {result?.summary && (
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold">Upload Result</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div className="border rounded-lg p-3"><span className="font-semibold">Total Rows:</span> {result.summary.totalRows}</div>
              <div className="border rounded-lg p-3"><span className="font-semibold">Inserted:</span> {result.summary.insertedCount}</div>
              <div className="border rounded-lg p-3"><span className="font-semibold">Failed:</span> {result.summary.failedCount}</div>
              <div className="border rounded-lg p-3"><span className="font-semibold">Duplicates:</span> {result.summary.duplicateCount}</div>
            </div>

            {Array.isArray(result.failedRows) && result.failedRows.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Line</th>
                      <th className="px-4 py-2 text-left text-sm">Roll</th>
                      <th className="px-4 py-2 text-left text-sm">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.failedRows.map((item, index) => (
                      <tr key={`${item.lineNumber}-${index}`} className="border-t">
                        <td className="px-4 py-2 text-sm">{item.lineNumber}</td>
                        <td className="px-4 py-2 text-sm">{item.roll}</td>
                        <td className="px-4 py-2 text-sm">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default UploadStudentsCsv;
