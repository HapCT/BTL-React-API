import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Upload, Button, Image, Select } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const API_BASE = "https://localhost:44352";

/**
 * SachForm — FIX ảnh:
 * - KHÔNG dùng controlled fileList trên <Upload> (tránh mất originFileObj)
 * - Dùng key để remount Upload mỗi khi mở form mới → reset sạch
 * - deleteOldImage được trả về qua prop callback để SachPage đọc khi submit
 */
const SachForm = ({ form, editing, theLoaiList, onDeleteOldImageChange }) => {
  const [deleteOldImage, setDeleteOldImage] = useState(false);
  // uploadKey thay đổi → Upload bị unmount/remount → fileList reset hoàn toàn
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    setDeleteOldImage(false);
    setUploadKey((k) => k + 1); // remount Upload → xóa file cũ trong UI
    form.setFieldValue("hinhAnh", []);
    if (onDeleteOldImageChange) onDeleteOldImageChange(false);
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteOld = () => {
    setDeleteOldImage(true);
    setUploadKey((k) => k + 1);
    form.setFieldValue("hinhAnh", []);
    if (onDeleteOldImageChange) onDeleteOldImageChange(true);
  };

  const handleUndoDelete = () => {
    setDeleteOldImage(false);
    if (onDeleteOldImageChange) onDeleteOldImageChange(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="tieuDe"
        label="Tên sách"
        rules={[{ required: true, message: "Tên sách không được để trống" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tacGia"
        label="Tác giả"
        rules={[{ required: true, message: "Tác giả không được để trống" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="maTheLoaiList"
        label="Thể loại (có thể chọn nhiều)"
        rules={[{ required: true, message: "Chọn ít nhất một thể loại" }]}
      >
        <Select
          mode="multiple"
          placeholder="Chọn thể loại"
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {theLoaiList?.map((tl) => (
            <Select.Option key={tl.maTheLoai} value={tl.maTheLoai}>
              {tl.tenTheLoai}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Form.Item name="namXB" label="Năm xuất bản">
          <InputNumber style={{ width: "100%" }} min={1900} max={2099} />
        </Form.Item>
        <Form.Item name="ngonNgu" label="Ngôn ngữ">
          <Input />
        </Form.Item>
      </div>

      <Form.Item name="soLuongSach" label="Số lượng">
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      {/* Ảnh hiện tại (chỉ khi đang sửa và chưa xóa) */}
      {editing?.hinhAnh && !deleteOldImage && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            background: "#fafafa",
            borderRadius: 8,
            border: "1px solid #f0f0f0",
          }}
        >
          <p style={{ marginBottom: 8, color: "#666", fontSize: 13 }}>
            Ảnh hiện tại:
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
              src={
                editing.hinhAnh.startsWith("http")
                  ? editing.hinhAnh
                  : `${API_BASE}${editing.hinhAnh}`
              }
              width={80}
              height={80}
              style={{ borderRadius: 6, objectFit: "cover" }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={handleDeleteOld}
            >
              Xóa ảnh cũ
            </Button>
          </div>
        </div>
      )}

      {deleteOldImage && (
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#ff4d4f", fontSize: 13 }}>
            ✕ Ảnh cũ sẽ bị xóa khi lưu
          </span>
          <Button type="link" size="small" onClick={handleUndoDelete}>
            Hoàn tác
          </Button>
        </div>
      )}

      {/* Upload ảnh mới — key thay đổi sẽ remount component, reset fileList */}
      <Form.Item
        name="hinhAnh"
        label={
          editing?.hinhAnh && !deleteOldImage
            ? "Thay bằng ảnh mới (tuỳ chọn)"
            : "Hình ảnh"
        }
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          // Ant Design truyền vào event object hoặc fileList trực tiếp
          const list = Array.isArray(e) ? e : e?.fileList ?? [];
          return list;
        }}
      >
        <Upload
          key={uploadKey}
          beforeUpload={() => false}   // chặn auto-upload
          maxCount={1}
          listType="picture"
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default SachForm;
