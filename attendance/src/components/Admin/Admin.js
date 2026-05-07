import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'

const Admin = () => {
  const navigate = useNavigate()
  return (
    <DashboardLayout>
      <section>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-6">
            <p className="uppercase tracking-[0.2em] text-xs text-emerald-600 font-semibold">Admin Dashboard</p>
            <h1 className="text-2xl font-bold mt-2">Welcome Admin</h1>
            <p className="text-sm text-gray-600 mt-2">Manage students, faculty, subjects, and attendance records.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="rounded-lg border p-6 cursor-pointer" onClick={() => navigate('/viewProff')}>
              <h2 className="text-lg font-semibold mb-2">View Professors</h2>
              <p className="text-sm text-gray-500">View details of professors.</p>
            </div>

            <div className="rounded-lg border p-6 cursor-pointer" onClick={() => navigate('/viewStudents')}>
              <h2 className="text-lg font-semibold mb-2">View Students</h2>
              <p className="text-sm text-gray-500">View details of students.</p>
            </div>

            <div className="rounded-lg border p-6 cursor-pointer" onClick={() => navigate('/viewAttendAdm')}>
              <h2 className="text-lg font-semibold mb-2">Attendance</h2>
              <p className="text-sm text-gray-500">View and update attendance records.</p>
            </div>

            <div className="rounded-lg border p-6 cursor-pointer" onClick={() => navigate('/viewSubjs')}>
              <h2 className="text-lg font-semibold mb-2">Manage Subjects</h2>
              <p className="text-sm text-gray-500">Add, update, or remove subjects.</p>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default Admin
