import jwt_decode from "jwt-decode";

const ALLOWED_ROLES = new Set(["student", "teacher", "admin"]);

const getStoredSession = () => {
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  return { token, type };
};

const isTokenExpired = (exp) => {
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("type");
};

export const getAuthSession = () => {
  const { token, type } = getStoredSession();

  if (!token) {
    return { token: null, role: null, user: null, isAuthenticated: false };
  }

  try {
    const decoded = jwt_decode(token);
    const role = decoded?.role || type;

    if (!role || !ALLOWED_ROLES.has(role) || isTokenExpired(decoded?.exp)) {
      clearAuthSession();
      return { token: null, role: null, user: null, isAuthenticated: false };
    }

    if (type !== role) {
      localStorage.setItem("type", role);
    }

    return {
      token,
      role,
      user: decoded,
      isAuthenticated: true
    };
  } catch (error) {
    clearAuthSession();
    return { token: null, role: null, user: null, isAuthenticated: false };
  }
};
