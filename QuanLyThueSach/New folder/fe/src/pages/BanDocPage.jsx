import React, { useEffect, useState, useRef } from "react";
import { Button, message, Modal, Form, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import BanDocForm from "../components/Form/BanDocForm";
import BanDocTable from "../components/Tables/BanDocTable";
import { getBanDocs, createBanDoc, updateBanDoc, deleteBanDoc } from "../services/BanDocService";

function BanDocPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const hasFetched = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBanDocs();
      let finalData = [];
      if (Array.isArray(res.data)) finalData = res.data;
      else if (Array.isArray(res.data?.data)) finalData = res.data.data;
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
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) { setFiltered(data); return; }
    const kw = val.toLowerCase();
    setFiltered(data.filter(d =>
      d.hoTen?.toLowerCase().includes(kw) ||
      d.email?.toLowerCase().includes(kw) ||
      d.soDienThoai?.includes(kw) ||
      d.maBanDoc?.toLowerCase().includes(kw) ||
      d.cccd?.includes(kw)
    ));
  };

  const handleAdd = () => { setEditing(null); form.resetFields(); setOpen(true); };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      hoTen: record.hoTen,
      soDienThoai: record.soDienThoai,
      email: record.email,
      hanThe: record.hanThe ? dayjs(record.hanThe) : null,
      trangThaiThe: record.trangThaiThe,
      duNo: record.duNo,
      cccd: record.cccd,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try { await deleteBanDoc(id); message.success("Xóa thành công"); fetchData(); }
    catch (err) { message.error(err.response?.data?.message || "Lỗi xóa"); }
  };

  const handleOK = async () => {
    try {
      const values = await form.validateFields();
      const baseData = {
        HoTen: values.hoTen, SoDienThoai: values.soDienThoai,
        Email: values.email, HanThe: values.hanThe?.format("YYYY-MM-DDTHH:mm:ss"),
        CCCD: values.cccd?.trim(),
      };
      if (editing) {
        await updateBanDoc(editing.maBanDoc, { ...baseData, TrangThaiThe: values.trangThaiThe, DuNo: values.duNo || 0 });
        message.success("Cập nhật thành công");
      } else {
        await createBanDoc(baseData);
        message.success("Thêm thành công");
      }
      setOpen(false); fetchData();
    } catch (err) { message.error(err.response?.data?.message || "Lỗi API"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý bạn đọc</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input placeholder="Tìm theo tên, email, CCCD..." prefix={<SearchOutlined />}
            value={search} onChange={handleSearch} style={{ width: 260 }} allowClear />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm bạn đọc</Button>
        </div>
      </div>
      <BanDocTable data={filtered} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal open={open} onOk={handleOK} onCancel={() => setOpen(false)}
        title={editing ? "Cập nhật bạn đọc" : "Thêm bạn đọc"} okText={editing ? "Cập nhật" : "Thêm"} cancelText="Hủy">
        <BanDocForm form={form} editing={editing} />
      </Modal>
    </div>
  );
}

export default BanDocPage;