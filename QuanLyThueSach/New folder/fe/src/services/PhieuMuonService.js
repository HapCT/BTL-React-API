import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/PhieuMuon`;

export const getPhieuMuons = () => {
  return axios.get(API);
};

export const tinhTien = (id) => {
  return axios.get(`${API}/tinh-tien/${id}`);
};

export const getPhieuMuonByBanDoc = (maBanDoc) => {
  return axios.get(`${API}/${maBanDoc}`);
};

// Đăng ký mượn online - chuyển soNgayMuon → HanTra
export const dangKyMuon = (data) => {
  const { maSach, maBanDoc, soNgayMuon } = data;
  const hanTra = new Date();
  hanTra.setDate(hanTra.getDate() + (soNgayMuon || 7));
  return axios.post(`${API}/dang-ky`, {
    maBanDoc,
    maSach,
    hanTra: hanTra.toISOString(),
  });
};

export const dangKyMuonOff = (data) => {
  return axios.post(`${API}/dang-ky-off`, data);
};

export const duyetMuon = (maPhieuMuon) => {
  return axios.put(`${API}/duyet/${maPhieuMuon}`);
};

export const traSach = (maPhieuMuon) => {
  return axios.put(`${API}/tra/${maPhieuMuon}`);
};

export const giaHan = (maPhieuMuon, soNgayThem) => {
  return axios.put(`${API}/gia-han/${maPhieuMuon}`, { soNgayThem });
};

export const huyPhieu = (maPhieuMuon) => {
  return axios.put(`${API}/huy/${maPhieuMuon}`);
};

export const deletePhieuMuon = (maPhieuMuon) => {
  return axios.delete(`${API}/${maPhieuMuon}`);
};