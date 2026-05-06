import React from "react";
import { Form, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const TheLoaiForm = ({ form, editing }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="tenTheLoai" label="Tên thể loại" messageVariables={{ name: "Tên thể loại" }} rules={[{ required: true, message: "Tên thể loại không được để trống" }]}>
        <Input />
      </Form.Item><Form.Item name="moTa" label="Mô tả" messageVariables={{ name: "Mô tả" }} rules={[{ required: true, message: "Mô tả không được để trống" }]}>
        <Input />
      </Form.Item>

    </Form>
  );
};

export default TheLoaiForm;

