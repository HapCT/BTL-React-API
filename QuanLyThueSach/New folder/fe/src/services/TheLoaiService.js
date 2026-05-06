import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/TheLoai`;

export const getTheLoais = () => {
  return axios.get(API);
};

export const createTheLoai = (formData) => {
  return axios.post(API, formData);
};

export const updateTheLoai = (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

export const deleteTheLoai = (id) => {
  return axios.delete(`${API}/${id}`);
};