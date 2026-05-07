export const getAuthSession = () => {
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  return { token, type };
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("type");
};
