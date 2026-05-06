import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/ThanhToan`;

export const thanhToan = (data) => {
  return axios.post(`${API}/thanh-toan`, data);
};

export const getThanhToans = () => {
  return axios.get(API);
};

export const previewThanhToan = (maPhieuMuon) => {
  return axios.get(`${API}/preview/${maPhieuMuon}`);
};

export const xuatHoaDon = (maThanhToan) => {
  return axios.get(`${API}/xuat/${maThanhToan}`, {
    responseType: "blob",
  });
};