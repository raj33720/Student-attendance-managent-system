import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthSession } from "../../utils/auth";
import GuestAttendance from "../Student/GuestAttendance";

const teacherLinks = [
  { to: "/teacher", label: "Dashboard" },
  { to: "/takeAttendance", label: "Take Attendance" }
];

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/viewStudents", label: "Students" },
  { to: "/viewProff", label: "Faculty" },
  { to: "/viewAttendAdm", label: "Attendance" },
  { to: "/viewSubjs", label: "Subjects" }
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileType, setProfileType] = useState(null);

  useEffect(() => {
    const { role } = getAuthSession();
    setProfileType(role);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setProfileType(null);
    navigate("/");
  };

  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleMyAttendance = () => {
    const { role } = getAuthSession();
    if (role === 'student') {
      navigate('/subjattendance');
      return;
    }
    // for other users or guests, show quick lookup modal
    setShowGuestModal(true);
  }

  const currentLinks = profileType === "teacher" ? teacherLinks : profileType === "admin" ? adminLinks : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="https://th.bing.com/th/id/R.1d9b65db314ae25aa85dfc2e19ed8952?rik=HoUy5%2fv5CiVIrA&riu=http%3a%2f%2fistar.edu.in%2findex_files%2fcvmuLOGO1.jpg&ehk=mUVFzevNFQ1VlcfYuDJLrrneHvvvjRL77WwLQoRyBKk%3d&risl=&pid=ImgRaw&r=0"
            alt="University logo"
            className="h-12 w-12 rounded-full border border-gray-200 bg-white p-1 shadow-sm hover:shadow-md transition-all"
          />
          <div>
            <p className="text-base md:text-lg font-bold text-gray-800">
              Student Attendance Management System
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold">
              CVM University
            </p>
          </div>
        </Link>

        <div className="flex-1 px-6">
          {currentLinks.length > 0 && (
            <nav className="hidden md:flex md:justify-start md:items-center md:gap-3 text-sm">
              {currentLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-full px-4 py-2 font-semibold transition-all duration-200 ${
                      isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleMyAttendance} className="rounded-full px-3 py-2 font-semibold text-gray-700 hover:bg-gray-100">
            My Attendance
          </button>
          {profileType && (
            <button onClick={handleLogout} className="primary-btn md:ml-2 flex items-center gap-2">
              Logout <LogoutIcon fontSize="small" />
            </button>
          )}
        </div>
        {showGuestModal && <GuestAttendance onClose={() => setShowGuestModal(false)} />}
      </div>
    </header>
  );
};

export default Header;
