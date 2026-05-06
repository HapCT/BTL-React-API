import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/DatCho`;

export const getDatChos = () => {
  return axios.get(API);
};


export const createDatCho = (data) => {
  return axios.post(API, data);
};


export const huyDatCho = (id) => {
  return axios.put(`${API}/huy/${id}`);
};


export const hetHanDatCho = () => {
  return axios.put(`${API}/hethan`);
};

export const tuDongMuon = (maSach) => {
  return axios.post(`${API}/tudong-muon?maSach=${maSach}`);
};