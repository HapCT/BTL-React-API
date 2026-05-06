import { Navigate, Outlet } from "react-router-dom";
import { isLogin, isAdmin, isThuThu } from "../utils/Auth";

const ProtectedRoute = ({ requireAdmin, requireThuThu }) => {
  if (!isLogin()) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && !isAdmin()) {
    if (isThuThu()) return <Navigate to="/thuthu" />;
    return <Navigate to="/index" />;
  }

  if (requireThuThu && !isThuThu() && !isAdmin()) {
    return <Navigate to="/index" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;