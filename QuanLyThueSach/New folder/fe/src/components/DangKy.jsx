import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from "react-router-dom";
import { createTaiKhoan } from '../services/TaiKhoanService';
const DangKyForm = () => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('horizontal');
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate("/login");
    }
    const onFormLayoutChange = ({ layout }) => {
        setFormLayout(layout);
    };
    const onFinish = async (values) => {
        try {
            const payload = {
                tenTaiKhoan: values.username,
                matKhau: values.password,
                hoTen: values.fullName,
                cccd: values.cccd,
                soDienThoai: values.phone,
                email: values.email,
            }
            await createTaiKhoan(payload);
            message.success("Đăng ký thành công");
            navigate("/index");
        } catch (err) {
            console.log("FULL ERROR:", err.response?.data);
            console.log("ERROR:", err.response?.data?.errors);
            message.error(err.response?.data?.message || "Lỗi đăng ký");
        }
    };
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{
                width: 600,
                padding: "30px",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                Đăng ký
            </h2>

            <Form.Item
                label="Tên tài khoản"
                name="username"
                rules={[{ required: true, message: "Nhập tên tài khoản" }]}
            >
                <Input placeholder="Tên tài khoản" />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Nhập mật khẩu" },
                {
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số"
                }
                ]}
            >
                <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                    { required: true, message: "Nhập lại mật khẩu" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Mật khẩu không khớp");
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Nhập lại để xác nhận mật khẩu" />
            </Form.Item>
            <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[{
                    required: true,
                    message: "Nhập họ tên"
                },
                {
                    pattern: /^[\p{L}\s]+$/u,
                    message: "Họ tên không hợp lệ"
                }

                ]}
            >
                <Input placeholder="Họ tên" />
            </Form.Item>

            <Form.Item
                label="CCCD"
                name="cccd"
                rules={[{ required: true, message: "Nhập số CCCD" },
                {
                    pattern: /^\d{12}$/,
                    message: "CCCD phải là số và có đúng 12 chữ số"
                }
                ]}
            >
                <Input placeholder="CCCD" />
            </Form.Item>

            <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Nhập số điện thoại" },
                {
                    pattern: /^\d{10}$/,
                    message: "Số điện thoại phải là số và có đúng 10 chữ số"
                }
                ]}
            >
                <Input placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Nhập email" },
                {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ"
                }
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>
                        Bạn đã có tài khoản?{" "}
                        <Button
                            type="link"
                            onClick={handleLogin}
                            style={{ padding: 0 }}
                        >
                            Đăng nhập
                        </Button>
                    </span>

                    <Button type="primary" htmlType='submit'>
                        Đăng ký
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default DangKyForm;