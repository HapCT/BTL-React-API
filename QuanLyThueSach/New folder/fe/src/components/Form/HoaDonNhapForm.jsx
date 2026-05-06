import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Table,
  Select,
  Space,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;

const HoaDonNhapForm = ({ form, sachList = [], editing }) => {
  const [chiTiet, setChiTiet] = useState(
    editing?.chiTiet?.map((ct, i) => ({ ...ct, key: i })) || []
  );

  // Sync chiTiet vào form mỗi khi thay đổi
  const syncChiTiet = (list) => {
    setChiTiet(list);
    form.setFieldValue("chiTiet", list);
  };

  const handleAddRow = () => {
    const newRow = {
      key: Date.now(),
      maSach: null,
      soLuong: 1,
      donGia: 0,
    };
    syncChiTiet([...chiTiet, newRow]);
  };

  const handleRemoveRow = (key) => {
    syncChiTiet(chiTiet.filter((r) => r.key !== key));
  };

  const handleCellChange = (key, field, value) => {
    syncChiTiet(
      chiTiet.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    );
  };

  const tongTien = chiTiet.reduce(
    (sum, r) => sum + (r.soLuong || 0) * (r.donGia || 0),
    0
  );

  const columns = [
    {
      title: "Sách",
      dataIndex: "maSach",
      width: "40%",
      render: (val, row) => (
        <Select
          value={val}
          style={{ width: "100%" }}
          placeholder="Chọn sách"
          showSearch
          filterOption={(input, opt) =>
            opt.children?.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(v) => handleCellChange(row.key, "maSach", v)}
        >
          {sachList.map((s) => (
            <Select.Option key={s.maSach} value={s.maSach}>
              {s.tieuDe}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      width: "18%",
      render: (val, row) => (
        <InputNumber
          min={1}
          value={val}
          style={{ width: "100%" }}
          onChange={(v) => handleCellChange(row.key, "soLuong", v)}
        />
      ),
    },
    {
      title: "Đơn giá (VND)",
      dataIndex: "donGia",
      width: "25%",
      render: (val, row) => (
        <InputNumber
          min={0}
          value={val}
          style={{ width: "100%" }}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(v) => v.replace(/,/g, "")}
          onChange={(v) => handleCellChange(row.key, "donGia", v)}
        />
      ),
    },
    {
      title: "Thành tiền",
      width: "12%",
      render: (_, row) =>
        ((row.soLuong || 0) * (row.donGia || 0)).toLocaleString("vi-VN") +
        "₫",
    },
    {
      title: "",
      width: 40,
      render: (_, row) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(row.key)}
        />
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Form.Item
          name="nhaCungCap"
          label="Nhà cung cấp"
          rules={[{ required: true, message: "Vui lòng nhập nhà cung cấp" }]}
        >
          <Input placeholder="Tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="ngayNhap"
          label="Ngày nhập"
          rules={[{ required: true, message: "Chọn ngày nhập" }]}
          initialValue={dayjs()}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
      </div>

      <Form.Item name="nguoiNhap" label="Người nhập">
        <Input placeholder="Tên người nhập kho" />
      </Form.Item>

      <Form.Item name="ghiChu" label="Ghi chú">
        <TextArea rows={2} placeholder="Ghi chú thêm..." />
      </Form.Item>

      <Divider orientation="left" style={{ fontSize: 13, color: "#666" }}>
        Chi tiết sách nhập
      </Divider>

      {/* Hidden field để validate chiTiet */}
      <Form.Item
        name="chiTiet"
        rules={[
          {
            validator: (_, val) =>
              val && val.length > 0
                ? Promise.resolve()
                : Promise.reject("Thêm ít nhất 1 sách vào hóa đơn"),
          },
        ]}
      >
        <Input type="hidden" />
      </Form.Item>

      <Table
        dataSource={chiTiet}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        footer={() => (
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
            >
              Thêm sách
            </Button>
            <span style={{ fontWeight: 600, color: "#1677ff" }}>
              Tổng cộng: {tongTien.toLocaleString("vi-VN")}₫
            </span>
          </Space>
        )}
      />
    </Form>
  );
};

export default HoaDonNhapForm;