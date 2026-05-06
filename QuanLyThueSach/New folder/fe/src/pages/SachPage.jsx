import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form, message, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import SachForm from "../components/Form/SachForm";
import SachTable from "../components/Tables/SachTable";
import {
  getSachs,
  createSach,
  updateSach,
  deleteSach,
} from "../services/SachService";
import { getTheLoais } from "../services/TheLoaiService";

function SachPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [theLoaiList, setTheLoaiList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  // Trạng thái xóa ảnh cũ — cập nhật từ SachForm qua callback
  const deleteOldImageRef = useRef(false);

  const fetchData = async () => {
    try {
      const res = await getSachs();
      const list = res.data?.data || [];
      setData(list);
      setFiltered(list);
    } catch {
      message.error("Lỗi tải danh sách sách");
    }
  };

  useEffect(() => {
    fetchData();
    getTheLoais()
      .then((res) => setTheLoaiList(res.data?.data || res.data || []))
      .catch(() => {});
  }, []);

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
            d.tieuDe?.toLowerCase().includes(kw) ||
            d.tacGia?.toLowerCase().includes(kw) ||
            d.maSach?.toLowerCase().includes(kw)
        )
      );
    }
  };

  const handleAdd = () => {
    setEditing(null);
    deleteOldImageRef.current = false;
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    deleteOldImageRef.current = false;
    form.setFieldsValue({
      tieuDe: record.tieuDe,
      tacGia: record.tacGia,
      maTheLoaiList:
        record.maTheLoaiList ||
        record.theLoaiList?.map((t) => t.maTheLoai) ||
        (record.maTheLoai ? [record.maTheLoai] : []),
      namXB: record.namXB,
      ngonNgu: record.ngonNgu,
      soLuongSach: record.soLuongSach,
      hinhAnh: [],
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSach(id);
      message.success("Xóa thành công");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi xóa");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      const formData = new FormData();
      formData.append("TieuDe", values.tieuDe || "");
      formData.append("TacGia", values.tacGia || "");
      formData.append("NamXB", values.namXB || "");
      formData.append("NgonNgu", values.ngonNgu || "");
      formData.append("SoLuongSach", values.soLuongSach ?? 0);

      if (values.maTheLoaiList?.length > 0) {
        values.maTheLoaiList.forEach((id) =>
          formData.append("DanhSachTheLoai", id)
        );
        formData.append("MaTheLoai", values.maTheLoaiList[0]);
      }

      // Kiểm tra có ảnh mới không
      // values.hinhAnh là FileList từ Ant Design Upload (array of UploadFile)
      const fileList = values.hinhAnh;
      const newFile =
        Array.isArray(fileList) && fileList.length > 0
          ? fileList[0]?.originFileObj
          : null;

      if (newFile) {
        // Có ảnh mới → upload ảnh mới (backend tự xóa ảnh cũ nếu có HinhAnhCu)
        formData.append("HinhAnh", newFile);
        if (editing?.hinhAnh) {
          formData.append("HinhAnhCu", editing.hinhAnh);
        }
      } else if (editing) {
        // Không có ảnh mới
        if (deleteOldImageRef.current) {
          // Người dùng bấm "Xóa ảnh cũ" → không append HinhAnhCu → backend xóa
        } else {
          // Giữ nguyên ảnh cũ
          if (editing.hinhAnh) {
            formData.append("HinhAnhCu", editing.hinhAnh);
          }
        }
      }

      if (editing) {
        await updateSach(editing.maSach, formData);
        message.success("Cập nhật thành công");
      } else {
        await createSach(formData);
        message.success("Thêm sách thành công");
      }

      setOpen(false);
      fetchData();
    } catch (err) {
      if (err?.errorFields) return; // lỗi validate — không cần toast
      message.error(err.response?.data?.message || "Lỗi xử lý");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý sách</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm kiếm sách..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            style={{ width: 240 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm sách
          </Button>
        </div>
      </div>

      <SachTable data={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        title={editing ? "Cập nhật sách" : "Thêm sách"}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        confirmLoading={confirmLoading}
        width={620}
        destroyOnClose
      >
        <SachForm
          form={form}
          editing={editing}
          theLoaiList={theLoaiList}
          onDeleteOldImageChange={(val) => {
            deleteOldImageRef.current = val;
          }}
        />
      </Modal>
    </div>
  );
}

export default SachPage;
