import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/BanDoc`;

export const getBanDocs = () => {
  return axios.get(API);
};

export const createBanDoc = (formData) => {
  return axios.post(API, formData);
};

export const updateBanDoc = (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

export const deleteBanDoc = (id) => {
  return axios.delete(`${API}/${id}`);
};