import React from "react";
import { Form, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const TheLoaiForm = ({ form, editing }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="tenKe" label="Tên kệ" messageVariables={{ name: "Tên kệ" }} rules={[{ required: true, message: "Tên kệ không được để trống" }]}>
        <Input />
      </Form.Item><Form.Item name="viTri" label="Vị trí" messageVariables={{ name: "Vị trí" }} rules={[{ required: true, message: "Vị trí không được để trống" }]}>
        <Input />
      </Form.Item>

    </Form>
  );
};

export default TheLoaiForm;

