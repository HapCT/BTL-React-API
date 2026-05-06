import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/Sach`;

export const getSachs = () => {
  return axios.get(API);
};

export const createSach = (formData) => {
  return axios.post(API, formData);
};

export const updateSach = (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

export const deleteSach = (id) => {
  return axios.delete(`${API}/${id}`);
};
export const getSachPhoBien = () => {
  return axios.get(`${API_BASE}/Sach/pho-bien`);
};
export const searchSach = (keyword) => {
  return axios.get(`${API_BASE}/Sach/search/${keyword}`);
};

export const getSachByTheLoai = (maTheLoai) => {
  return axios.get(`${API_BASE}/Sach/by-theloai/${maTheLoai}`);
};

export const getSachDetail = (maSach) => {
  return axios.get(`${API}/${maSach}`);
};