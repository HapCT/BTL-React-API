import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DangNhapLayout from "./layouts/DangNhapLayout";
import DangKyPage from "./pages/DangKyPage";
import DangNhapPage from "./pages/DangNhapPage";
import ProtectedRoute from "./routes/ProtectedRoute";

// Admin pages
import BanDocPage from "./pages/BanDocPage";
import SachPage from "./pages/SachPage";
import BanSaoPage from "./pages/BanSaoPage";
import KeSachPage from "./pages/KeSachPage";
import TaiKhoanPage from "./pages/TaiKhoanPage";
import TheLoaiPage from "./pages/TheLoaiPage";
import DatChoPage from "./pages/DatChoPage";
import PhatPage from "./pages/PhatPage";
import PhieuMuonPage from "./pages/PhieuMuonPage";
import ThanhToanPage from "./pages/ThanhToanPage";
import HoaDonNhapPage from "./pages/HoaDonNhapPage";
import DashboardPage from "./pages/DashboardPage";
// User pages
import UserPage from "./pages/UserPage";
import TimKiemPage from "./pages/TimKiemPage";
import BooksPage from "./pages/BooksPage";
import DanhMucPage from "./pages/DanhMucPage";
import SachDetailPage from "./pages/SachDetailPage";
import RentalsPage from "./pages/RentalsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
// ThuThu
import ThuThuLayout from "./layouts/ThuThuLayout";
import ThuThuDashboard from "./pages/ThuThuDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC — trang chủ không cần đăng nhập */}
        <Route path="/" element={<UserPage />} />
        <Route path="/index" element={<UserPage />} />
        <Route path="/search" element={<TimKiemPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/danhmuc" element={<DanhMucPage />} />
        <Route path="/sach/:maSach" element={<SachDetailPage />} />

        {/* LOGIN / REGISTER */}
        <Route element={<DangNhapLayout />}>
          <Route path="/login" element={<DangNhapPage />} />
          <Route path="/dangky" element={<DangKyPage />} />
        </Route>

        {/* USER ROUTES — cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* THUTHU ROUTES */}
        <Route element={<ProtectedRoute requireThuThu={true} />}>
          <Route element={<ThuThuLayout />}>
            <Route path="/thuthu" element={<ThuThuDashboard />} />
            <Route path="/thuthu/bandoc" element={<BanDocPage />} />
            <Route path="/thuthu/sach" element={<SachPage />} />
            <Route path="/thuthu/bansao" element={<BanSaoPage />} />
            <Route path="/thuthu/phieumuon" element={<PhieuMuonPage />} />
            <Route path="/thuthu/datcho" element={<DatChoPage />} />
            <Route path="/thuthu/phat" element={<PhatPage />} />
            <Route path="/thuthu/thanhtoan" element={<ThanhToanPage />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/bandoc" element={<BanDocPage />} />
            <Route path="/sach" element={<SachPage />} />
            <Route path="/bansao" element={<BanSaoPage />} />
            <Route path="/kesach" element={<KeSachPage />} />
            <Route path="/taikhoan" element={<TaiKhoanPage />} />
            <Route path="/theloai" element={<TheLoaiPage />} />
            <Route path="/datcho" element={<DatChoPage />} />
            <Route path="/phat" element={<PhatPage />} />
            <Route path="/phieumuon" element={<PhieuMuonPage />} />
            <Route path="/thanhtoan" element={<ThanhToanPage />} />
            <Route path="/hoadonnhap" element={<HoaDonNhapPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;