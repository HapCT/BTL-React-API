import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from "react-router-dom";
import { dangnhapTaiKhoan } from '../services/TaiKhoanService';

const DangNhapForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/dangky");
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        tenTaiKhoan: values.username,
        matKhau: values.password,
      };

      const res = await dangnhapTaiKhoan(payload);

      // Kiểm tra status TRƯỚC khi lưu
      if (res.data.statusCode !== 200) {
        message.error(res.data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      const user = res.data?.data;

      if (!user || !user.token) {
        message.error("Đăng nhập thất bại, thử lại sau");
        return;
      }

      // Lưu sau khi xác nhận thành công
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(user));

      message.success("Đăng nhập thành công!");

      const role = String(user?.vaiTro || "").trim();
      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Thủ thư") {
        navigate("/thuthu");
      } else {
        navigate("/index");
      }

    } catch (err) {
      const errMsg = err.response?.data?.message || "Sai tài khoản hoặc mật khẩu";
      message.error(errMsg);
    } finally {
      setLoading(false);
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
        Đăng nhập
      </h2>

      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
      >
        <Input placeholder="Tên đăng nhập" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Nhập mật khẩu" }]}
      >
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            Chưa có tài khoản?{" "}
            <Button type="link" onClick={handleSignup} style={{ padding: 0 }}>
              Đăng ký
            </Button>
          </span>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default DangNhapForm;