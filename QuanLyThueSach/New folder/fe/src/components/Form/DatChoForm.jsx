import React from "react";
import { Form, Select } from "antd";

const DatChoForm = ({ form, sachList, banDocList }) => {
  return (
    <Form form={form} layout="vertical">

      {/* Chọn bạn đọc */}
      <Form.Item
        name="maBanDoc"
        label="Bạn đọc"
        rules={[{ required: true, message: "Vui lòng chọn bạn đọc" }]}
      >
        <Select placeholder="Chọn bạn đọc">
          {banDocList?.map((bd) => (
            <Select.Option key={bd.maBanDoc} value={bd.maBanDoc}>
              {bd.hoTen}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Chọn sách */}
      <Form.Item
        name="maSach"
        label="Sách"
        rules={[{ required: true, message: "Vui lòng chọn sách" }]}
      >
        <Select placeholder="Chọn sách">
          {sachList?.map((s) => (
            <Select.Option key={s.maSach} value={s.maSach}>
              {s.tieuDe}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

    </Form>
  );
};

export default DatChoForm;