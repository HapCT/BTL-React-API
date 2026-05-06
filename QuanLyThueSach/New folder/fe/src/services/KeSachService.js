import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/KeSach`;

export const getKeSachs = () => {
  return axios.get(API);
};

export const createKeSach = (formData) => {
  return axios.post(API, formData);
};

export const updateKeSach = (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

export const deleteKeSach = (id) => {
  return axios.delete(`${API}/${id}`);
};