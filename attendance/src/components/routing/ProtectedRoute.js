import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthSession } from "../../utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { token, type } = getAuthSession();

  if (!token || !type || !allowedRoles.includes(type)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
