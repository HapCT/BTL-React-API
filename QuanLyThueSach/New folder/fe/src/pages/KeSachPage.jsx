import React, { useEffect, useState, useRef } from "react";
import { Button, message, Modal, Form } from "antd";
import KeSachForm from "../components/Form/KeSachForm";
import KeSachTable from "../components/Tables/KeSachTable";
import {
  getKeSachs,
  createKeSach,
  updateKeSach,
  deleteKeSach
} from "../services/KeSachService";

function KeSachPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const hasFetched = useRef(false);

  // ✅ FIX: gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getKeSachs();

      let finalData = [];

      if (Array.isArray(res.data)) {
        finalData = res.data;
      } else if (Array.isArray(res.data.data)) {
        finalData = res.data.data;
      } else if (res.data.data && Array.isArray(res.data.data.data)) {
        finalData = res.data.data.data;
      } else if (Array.isArray(res.data.items)) {
        finalData = res.data.items;
      }

      setData(finalData);

    } catch (err) {
      console.error("Lỗi API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      maKe: record.maKe,
      tenKe: record.tenKe,
      viTri: record.viTri,
    });

    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteKeSach(id);
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
        tenKe: values.tenKe,
        viTri: values.viTri
      };

      if (editing) {
        await updateKeSach(editing.maKe, payload);
        message.success("Cập nhật thành công");
      } else {
        await createKeSach(payload);
        message.success("Thêm thành công");
      }

      setOpen(false);
      await fetchData();

    } catch (err) {
      console.log("ERROR:", err.response?.data);
    }
  };

  return (
    <div>
      <h2>Danh sách kệ sách</h2>

      <Button onClick={handleAdd} style={{ marginBottom: "10px" }}>
        Thêm kệ sách
      </Button>

      <KeSachTable
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        title={editing ? "Cập nhật kệ sách" : "Thêm kệ sách"}
      >

        <KeSachForm form={form} editing={editing} />
      </Modal>
    </div>
  );
}


export default KeSachPage;