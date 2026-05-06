import API_BASE from "../constant/api";

import axios from "axios";

export const getTaiKhoans = () => {
  return axios.get(`${API_BASE}/TaiKhoan`);
};

export const createTaiKhoan = (data) => {
    return axios.post(`${API_BASE}/TaiKhoan`, data);
};
export const createTaiKhoanThuThu = (data) => {
    return axios.post(`${API_BASE}/TaiKhoan/dangky-thuthu`, data);
}
export const dangnhapTaiKhoan = (data) => {
    return axios.post(`${API_BASE}/TaiKhoan/dang-nhap`, data);
};

export const updateTaiKhoan = (tenTaiKhoan, data) => {
    return axios.put(`${API_BASE}/TaiKhoan/doi-mat-khau/${tenTaiKhoan}`, data);
};

export const deleteTaiKhoan = (tenTaiKhoan) => {
    return axios.delete(`${API_BASE}/TaiKhoan/${tenTaiKhoan}`);
};