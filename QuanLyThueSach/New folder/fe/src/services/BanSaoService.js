import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/BanSao`;

export const getBanSaos = () => {
  return axios.get(API);
};

export const createBanSao = (formData) => {
  return axios.post(API, formData);
};

export const updateBanSao = (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

export const deleteBanSao = (id) => {
  return axios.delete(`${API}/${id}`);
};