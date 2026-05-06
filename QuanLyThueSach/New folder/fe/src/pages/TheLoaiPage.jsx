import React, { useEffect, useState, useRef } from "react";
import { Button, message, Modal, Form, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TheLoaiForm from "../components/Form/TheLoaiForm";
import TheLoaiTable from "../components/Tables/TheLoaiTable";
import {
  getTheLoais,
  createTheLoai,
  updateTheLoai,
  deleteTheLoai,
} from "../services/TheLoaiService";

function TheLoaiPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const hasFetched = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTheLoais();
      let finalData = [];
      if (Array.isArray(res.data)) finalData = res.data;
      else if (Array.isArray(res.data?.data)) finalData = res.data.data;
      else if (Array.isArray(res.data?.data?.data)) finalData = res.data.data.data;
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

  // Lọc tìm kiếm
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) {
      setFiltered(data);
    } else {
      const kw = val.toLowerCase();
      setFiltered(
        data.filter(
          (d) =>
            d.tenTheLoai?.toLowerCase().includes(kw) ||
            d.moTa?.toLowerCase().includes(kw) ||
            d.maTheLoai?.toLowerCase().includes(kw)
        )
      );
    }
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      tenTheLoai: record.tenTheLoai,
      moTa: record.moTa,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTheLoai(id);
      message.success("Xóa thành công");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi xóa");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        TenTheLoai: values.tenTheLoai,
        MoTa: values.moTa,
      };
      if (editing) {
        await updateTheLoai(editing.maTheLoai, payload);
        message.success("Cập nhật thành công");
      } else {
        await createTheLoai(payload);
        message.success("Thêm thành công");
      }
      setOpen(false);
      await fetchData();
    } catch (err) {
      if (err?.response) message.error(err.response?.data?.message || "Lỗi xử lý");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý thể loại</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm kiếm thể loại..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            style={{ width: 240 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm thể loại
          </Button>
        </div>
      </div>

      <TheLoaiTable
        data={filtered}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        title={editing ? "Cập nhật thể loại" : "Thêm thể loại"}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <TheLoaiForm form={form} editing={editing} />
      </Modal>
    </div>
  );
}

export default TheLoaiPage;