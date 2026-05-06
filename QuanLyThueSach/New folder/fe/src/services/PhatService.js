import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/Phat`;

// 🔹 Lấy danh sách
export const getPhats = () => axios.get(API);

// 🔹 Tìm kiếm
export const searchPhat = (keyword, trangThai) => {
  return axios.get(`${API}/search`, {
    params: { keyword, trangThai }
  });
};

// 🔹 Thêm phạt (hỏng / mất)
export const createPhat = (data) => {
  return axios.post(API, data);
};

// 🔹 Huỷ phạt
export const huyPhat = (maPhat) => {
  return axios.put(`${API}/huy/${maPhat}`);
};