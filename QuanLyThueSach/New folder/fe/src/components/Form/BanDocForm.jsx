import React from "react";
import { Form, Input, InputNumber, Select, Date, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const BanDocForm = ({ form, editing }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="hoTen" label="Họ tên" messageVariables={{ name: "Họ tên" }} rules={[{ required: true, message: "Họ tên không được để trống" }]}>
        <Input />
      </Form.Item><Form.Item name="soDienThoai" label="SĐT" messageVariables={{ name: "SĐT" }} rules={[{ required: true, message: "SĐT không được để trống" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="hanThe" label="Hạn thẻ" messageVariables={{ name: "Hạn thẻ" }} rules={[{ required: true, message: "Hạn thẻ không được để trống" }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name="email" label="Email" messageVariables={{ name: "Email" }} rules={[{ required: true, message: "Email không được để trống", type: 'email', message: "Email không hợp lệ", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="cccd" label="CCCD" messageVariables={{ name: "CCCD" }} rules={[{ required: true, message: "CCCD không được để trống", pattern: /^\d{12}$/, message: "CCCD phải là 12 chữ số" }]}>
        <Input />
      </Form.Item>
      {editing && (
        <>
          <Form.Item name="trangThaiThe" label="Trạng thái" messageVariables={{ name: "Trạng thái" }} rules={[{ required: true, message: "Trạng thái không được để trống" }]}>
            <Select placeholder="Chọn trạng thái" name="trangThaiThe"
              label="Trạng thái"
              rules={[{ required: true, message: "Phải chọn trạng thái" }]}>
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="LOCKED">Bị khóa</Select.Option>
              <Select.Option value="EXPIRED">Hết hạn</Select.Option>
              <Select.Option value="INACTIVE">Ngừng sử dụng</Select.Option>
            </Select>
          </Form.Item>
        </>
      )}

    </Form>
  );
};

export default BanDocForm;

