export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isLogin = () => {
  const user = getUser();
  // Phải có user VÀ có token mới coi là đã đăng nhập
  return !!(user && user.token);
};

export const isAdmin = () => {
  const user = getUser();
  if (!user || !user.token) return false;
  return user.vaiTro === "Admin";
};

export const isThuThu = () => {
  const user = getUser();
  if (!user || !user.token) return false;
  return user.vaiTro === "Thủ thư";
};

export const isAdminOrThuThu = () => {
  const user = getUser();
  if (!user || !user.token) return false;
  return user.vaiTro === "Admin" || user.vaiTro === "Thủ thư";
};

export const getToken = () => {
  return getUser()?.token || null;
};

export const logout = () => {
  localStorage.removeItem("user");
};