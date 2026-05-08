import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthSession } from "../../utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { token, role } = getAuthSession();

  if (!token || !role || !allowedRoles.includes(role)) {
    const loginPath =
      allowedRoles.length === 1 && allowedRoles[0] === "admin"
        ? "/adminLogin"
        : "/";
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
