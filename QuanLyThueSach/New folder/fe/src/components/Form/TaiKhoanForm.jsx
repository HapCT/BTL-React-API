import React from "react";
import { Form, Input, Select } from "antd";
const TaiKhoanForm = ({ form }) => {
    return (
        <Form form={form} layout="vertical">

            <Form.Item
                name="tenTaiKhoan"
                label="Tên tài khoản"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="matKhau"
                label="Mật khẩu"
                rules={[{ required: true }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="vaiTro"
                label="Vai trò"
                rules={[{ required: true }]}
            >
                <Select>
                    <Select.Option value="Thủ thư">Thủ thư</Select.Option>
                </Select>
            </Form.Item>

        </Form>
    );
};
export default TaiKhoanForm;