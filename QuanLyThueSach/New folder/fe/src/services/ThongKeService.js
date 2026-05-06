import axios from "axios";
import API_BASE from "../constant/api";

const API = `${API_BASE}/ThongKe`;

export const getTongQuan = () => axios.get(`${API}/tong-quan`);
export const getDoanhThu = () => axios.get(`${API}/doanh-thu`);
export const getSachMuonNhieu = () => axios.get(`${API}/sach-muon-nhieu`);
export const getBanDocTichCuc = () => axios.get(`${API}/ban-doc-tich-cuc`);
export const getThongKeTheLoai = () => axios.get(`${API}/the-loai`);