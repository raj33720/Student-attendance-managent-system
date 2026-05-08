import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import BookIcon from '@mui/icons-material/Book'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CloseIcon from '@mui/icons-material/Close'
import { getAuthSession } from '../../utils/auth'

const Sidebar = ({ open = false, onClose = () => {} }) => {
  const location = useLocation()
  const { role } = getAuthSession()

  const teacherLinks = [
    { to: '/teacher', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/takeAttendance', label: 'Take Attendance', icon: <EventAvailableIcon /> },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/viewStudents', label: 'Students', icon: <PeopleIcon /> },
    { to: '/viewProff', label: 'Faculty', icon: <PeopleIcon /> },
    { to: '/viewAttendAdm', label: 'Attendance', icon: <ListAltIcon /> },
    { to: '/viewSubjs', label: 'Subjects', icon: <BookIcon /> },
  ]

  const studentLinks = [
    { to: '/student', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/subjattendance', label: 'My Attendance', icon: <ListAltIcon /> },
  ]

  const links = role === 'teacher' ? teacherLinks : role === 'admin' ? adminLinks : role === 'student' ? studentLinks : []

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-64 p-4 h-screen sticky top-4">
        <div className="bg-white rounded-xl shadow px-4 py-5 flex items-center gap-3 mb-6">
          <img
            src="https://th.bing.com/th/id/R.1d9b65db314ae25aa85dfc2e19ed8952?rik=HoUy5%2fv5CiVIrA&riu=http%3a%2f%2fistar.edu.in%2findex_files%2fcvmuLOGO1.jpg&ehk=mUVFzevNFQ1VlcfYuDJLrrneHvvvjRL77WwLQoRyBKk%3d&risl=&pid=ImgRaw&r=0"
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-sm font-bold">CVM University</div>
            <div className="text-xs text-gray-500">Attendance</div>
          </div>
        </div>

        <nav className="flex-1">
          {links.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md mb-2 text-sm transition-all ${
                  active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                <div>{item.label}</div>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile sliding sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
        <div className={`absolute left-0 top-0 h-full w-64 bg-white p-4 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform`}> 
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src="https://th.bing.com/th/id/R.1d9b65db314ae25aa85dfc2e19ed8952?rik=HoUy5%2fv5CiVIrA&riu=http%3a%2f%2fistar.edu.in%2findex_files%2fcvmuLOGO1.jpg&ehk=mUVFzevNFQ1VlcfYuDJLrrneHvvvjRL77WwLQoRyBKk%3d&risl=&pid=ImgRaw&r=0" alt="logo" className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-sm font-bold">CVM University</div>
                <div className="text-xs text-gray-500">Attendance</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close menu" className="p-2 rounded-md hover:bg-gray-100"><CloseIcon /></button>
          </div>

          <nav className="flex-1">
            {links.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md mb-2 text-sm transition-all ${
                    active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <div>{item.label}</div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
