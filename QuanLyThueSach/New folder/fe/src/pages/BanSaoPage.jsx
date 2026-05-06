import React, { useEffect, useState, useRef } from "react";
import { Button, message, Modal, Form, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import BanSaoForm from "../components/Form/BanSaoForm";
import BanSaoTable from "../components/Tables/BanSaoTable";
import { getSachs } from "../services/SachService";
import { getKeSachs } from "../services/KeSachService";
import { getBanSaos, createBanSao, updateBanSao, deleteBanSao } from "../services/BanSaoService";

function BanSaoPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sachList, setSachList] = useState([]);
  const [KeList, setKeList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const hasFetched = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBanSaos();
      let finalData = [];
      if (Array.isArray(res.data)) finalData = res.data;
      else if (Array.isArray(res.data?.data)) finalData = res.data.data;
      else if (Array.isArray(res.data?.data?.data)) finalData = res.data.data.data;
      else if (Array.isArray(res.data?.items)) finalData = res.data.items;
      setData(finalData);
      setFiltered(finalData);
    } catch (err) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
    getSachs().then(res => setSachList(res.data?.data || res.data || []));
    getKeSachs().then(res => setKeList(res.data?.data || res.data || []));
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) { setFiltered(data); return; }
    const kw = val.toLowerCase();
    setFiltered(data.filter(d =>
      d.maBanSao?.toLowerCase().includes(kw) ||
      d.tieuDe?.toLowerCase().includes(kw) ||
      d.maSach?.toLowerCase().includes(kw) ||
      d.trangThai?.toLowerCase().includes(kw)
    ));
  };

  const handleAdd = () => { setEditing(null); form.resetFields(); setOpen(true); };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ maBanSao: record.maBanSao, maSach: record.maSach, tieuDe: record.tieuDe, maKe: record.maKe, tenKe: record.tenKe, trangThai: record.trangThai });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try { await deleteBanSao(id); message.success("Xóa thành công"); fetchData(); }
    catch (err) { message.error(err.response?.data?.message || "Lỗi xóa"); }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateBanSao(editing.maBanSao, { maSach: values.maSach, maKe: values.maKe, trangThai: values.trangThai });
        message.success("Cập nhật thành công");
      } else {
        await createBanSao({ maSach: values.maSach, soLuong: values.soLuong });
        message.success("Thêm thành công");
      }
      setOpen(false);
      await fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi xử lý");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý bản sao</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input placeholder="Tìm theo mã, tên sách, trạng thái..." prefix={<SearchOutlined />}
            value={search} onChange={handleSearch} style={{ width: 280 }} allowClear />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm bản sao</Button>
        </div>
      </div>
      <BanSaoTable data={filtered} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal open={open} onOk={handleOk} onCancel={() => setOpen(false)}
        title={editing ? "Cập nhật bản sao" : "Thêm bản sao"} okText={editing ? "Cập nhật" : "Thêm"} cancelText="Hủy">
        <BanSaoForm form={form} editing={editing} sachList={sachList} KeList={KeList} />
      </Modal>
    </div>
  );
}

export default BanSaoPage;