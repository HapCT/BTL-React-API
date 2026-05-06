import React, { useState } from "react";
import { message, Form, Input, Modal } from "antd";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import { getUser } from "../utils/Auth";
import { updateTaiKhoan } from "../services/TaiKhoanService";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [modalPW, setModalPW] = useState(false);
  const [form] = Form.useForm();

  if (!user) { navigate("/login"); return null; }

  const handleDoiMatKhau = async () => {
    try {
      const values = await form.validateFields();
      await updateTaiKhoan(user.tenTaiKhoan, {
        matKhauCu: values.matKhauCu,
        matKhauMoi: values.matKhauMoi,
      });
      message.success("Đổi mật khẩu thành công!");
      setModalPW(false);
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fields = [
    { label: "Họ tên", value: user.hoTen },
    { label: "Tên tài khoản", value: user.tenTaiKhoan },
    { label: "Email", value: user.email },
    { label: "Số điện thoại", value: user.soDienThoai },
    { label: "CCCD", value: user.cccd },
    { label: "Vai trò", value: user.vaiTro },
  ];

  return (
    <>
      <HeaderUser />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
        <h2 style={{ marginBottom: 24 }}>Hồ sơ của tôi</h2>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f0f0f0", padding: 24, marginBottom: 16 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#1677ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff", fontWeight: 700 }}>
              {(user.hoTen || user.tenTaiKhoan || "?")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{user.hoTen || user.tenTaiKhoan}</div>
              <div style={{ color: "#888" }}>{user.email}</div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {fields.map((f) => f.value && (
                <tr key={f.label} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 0", color: "#888", width: 160 }}>{f.label}</td>
                  <td style={{ padding: "10px 0", fontWeight: 500 }}>{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setModalPW(true)}
            style={{ padding: "10px 20px", background: "#1677ff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
          >
            Đổi mật khẩu
          </button>
          <button
            onClick={() => navigate("/rentals")}
            style={{ padding: "10px 20px", background: "#f5f5f5", color: "#333", border: "1px solid #d9d9d9", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
          >
            Phiếu mượn
          </button>
          <button
            onClick={() => navigate("/cart")}
            style={{ padding: "10px 20px", background: "#f5f5f5", color: "#333", border: "1px solid #d9d9d9", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
          >
            Đặt chỗ
          </button>
          <button
            onClick={handleLogout}
            style={{ padding: "10px 20px", background: "#fff", color: "#ff4d4f", border: "1px solid #ff4d4f", borderRadius: 8, cursor: "pointer", fontWeight: 600, marginLeft: "auto" }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <Modal
        open={modalPW}
        title="Đổi mật khẩu"
        onOk={handleDoiMatKhau}
        onCancel={() => { setModalPW(false); form.resetFields(); }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="matKhauCu" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="matKhauMoi" label="Mật khẩu mới"
            rules={[{ required: true }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: "Ít nhất 8 ký tự, gồm chữ và số" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="xacNhan" label="Xác nhận mật khẩu mới"
            dependencies={["matKhauMoi"]}
            rules={[{ required: true }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("matKhauMoi") === value) return Promise.resolve();
                return Promise.reject("Mật khẩu không khớp");
              }
            })]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <FooterUser />
    </>
  );
};

export default ProfilePage;