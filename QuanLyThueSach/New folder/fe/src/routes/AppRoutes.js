import React from "react";
import {Route, Routes } from "react-router-dom";
import BanDocPage from "../pages/BanDocPage";
import SachPage from "../pages/SachPage";
import BanSaoPage from "../pages/BanSaoPage";
import KeSachPage from "../pages/KeSachPage";
import TaiKhoanPage from "../pages/TaiKhoanPage";
import TheLoaiPage from "../pages/TheLoaiPage";
import DatChoPage from "../pages/DatChoPage";
import PhatPage from "../pages/PhatPage";
import PhieuMuonPage from "../pages/PhieuMuonPage";
import ThanhToanPage from "../pages/ThanhToanPage"
const AppRoutes = () => {
  return (
    <>
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
    </>
  );
};

export default AppRoutes;