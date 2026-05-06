import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/HoaDonNhap`;

// Lấy danh sách hóa đơn nhập
export const getHoaDonNhaps = () => axios.get(API);

// Lấy chi tiết hóa đơn nhập (kèm chi tiết sách)
export const getHoaDonNhapById = (id) => axios.get(`${API}/${id}`);

// Tạo hóa đơn nhập mới
export const createHoaDonNhap = (data) => axios.post(API, data);

// Cập nhật hóa đơn nhập
export const updateHoaDonNhap = (id, data) => axios.put(`${API}/${id}`, data);

// Xóa hóa đơn nhập
export const deleteHoaDonNhap = (id) => axios.delete(`${API}/${id}`);