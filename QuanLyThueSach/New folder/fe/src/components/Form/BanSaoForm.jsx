import React from "react";
import { Form, InputNumber, Select } from "antd";

const BanSaoForm = ({ editing, form, sachList, KeList }) => {
    return (
        <Form form={form} layout="vertical">

            <Form.Item
                name="maSach"
                label="Sách"
                rules={[{ required: true }]}
            >
                <Select>
                    {sachList?.map((s) => (
                        <Select.Option key={s.maSach} value={s.maSach}>
                            {s.tieuDe}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {!editing && (
                <Form.Item
                    name="soLuong"
                    label="Số lượng"
                    rules={[{ required: true }]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>
            )}

            {/* Chỉ hiện khi sửa */}
            {editing && (
                <>
                    <Form.Item
                        name="maKe"
                        label="Kệ sách"
                    >
                        <Select>
                            {KeList?.map((k) => (
                                <Select.Option key={k.maKe} value={k.maKe}>
                                    {k.tenKe}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="trangThai"
                        label="Trạng thái"
                    >
                        <Select>
                            <Select.Option value="AVAILABLE">Trong kho</Select.Option>
                            <Select.Option value="BORROWED">Đang mượn</Select.Option>
                            <Select.Option value="DAMAGED">Hỏng</Select.Option>
                            <Select.Option value="DESTROYED">Thanh lý</Select.Option>

                        </Select>
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default BanSaoForm;