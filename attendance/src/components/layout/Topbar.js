import React, { useMemo } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '../../utils/auth'

const Topbar = ({ onMenuToggle }) => {
  const navigate = useNavigate()
  const profileName = useMemo(() => {
    const { user } = getAuthSession()
    return user?.name || user?.roll || 'User'
  }, [])

  const handleProfileClick = () => {
    const { role } = getAuthSession()
    if (role === 'student') navigate('/student')
    else if (role === 'teacher') navigate('/teacher')
    else if (role === 'admin') navigate('/admin')
  }

  const handleLogout = () => {
    clearAuthSession()
    navigate('/')
  }

  return (
    <div className="w-full bg-white rounded-xl shadow p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 mr-2 rounded-md hover:bg-gray-100" onClick={onMenuToggle} aria-label="Open menu">
          <MenuIcon />
        </button>
        <div className="relative">
          <input
            placeholder="Search for student, Teacher or Document"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-56 md:w-80 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-300"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon fontSize="small" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsNoneIcon className="text-gray-600" />
        <button onClick={handleProfileClick} className="flex items-center gap-2">
          <AccountCircleIcon className="text-gray-600" />
          <span className="text-sm text-gray-700">{profileName}</span>
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogoutIcon fontSize="small" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
