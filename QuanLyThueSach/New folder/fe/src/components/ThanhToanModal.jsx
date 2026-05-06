import React from "react";
import { Modal, Steps, Spin, Select, Input } from "antd";
import { CreditCardOutlined, WalletOutlined, FileTextOutlined, QrcodeOutlined } from "@ant-design/icons";
import { PAYMENT_METHODS, buildQR, isOnlineMethod, BANK_ACCOUNT } from "../constant/RentalsConstants ";
import styles from "../assets/css/Rentalsstyles";

const ThanhToanModal = ({
  open, onCancel,
  thanhToanStep, previewLoading,
  preview, thanhToanPhieu,
  hinhThuc, setHinhThuc,
  ghiChu, setGhiChu,
  soTienTra, setSoTienTra,
  thanhToanLoading,
  thanhToanResult,
  onConfirm,
  onXuatHoaDon,
}) => {
  const tongTien  = Number(preview?.tongTien || 0);
  const soTienNum = Number(soTienTra) || 0;
  const showQR    = isOnlineMethod(hinhThuc) && soTienNum > 0;

  return (
    <Modal
      open={open}
      title={<span><CreditCardOutlined style={{ marginRight: 8, color: "#1677ff" }} />Thanh toán &amp; Trả sách</span>}
      footer={null}
      onCancel={onCancel}
      width={540}
    >
      <Steps
        current={thanhToanStep}
        size="small"
        style={{ marginBottom: 24 }}
        items={[{ title: "Tải thông tin" }, { title: "Xác nhận" }, { title: "Hoàn tất" }]}
      />

      {/* Bước 0: đang tải */}
      {thanhToanStep === 0 && previewLoading && (
        <div style={{ textAlign: "center", padding: 40 }}><Spin tip="Đang tính tiền..." /></div>
      )}

      {/* Bước 1: nhập thông tin thanh toán */}
      {thanhToanStep === 1 && preview && (
        <div>
          {/* Hóa đơn */}
          <div style={styles.invoiceBox}>
            <h4 style={{ marginBottom: 16, color: "#333" }}>🧾 Chi tiết hóa đơn</h4>
            <div style={{ marginBottom: 8 }}>📖 <b>{thanhToanPhieu?.tenSach || `Sách #${thanhToanPhieu?.maSach}`}</b></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 0", fontSize: 14 }}>
              <span style={{ color: "#888" }}>Phí thuê sách:</span>
              <span style={{ textAlign: "right" }}><b>{Number(preview.tienThue || 0).toLocaleString("vi-VN")} đ</b></span>
              <span style={{ color: "#888" }}>Phí phạt (nếu có):</span>
              <span style={{ textAlign: "right", color: preview.tienPhat > 0 ? "#ff4d4f" : "inherit" }}>
                <b>{Number(preview.tienPhat || 0).toLocaleString("vi-VN")} đ</b>
              </span>
              <div style={{ gridColumn: "1/-1", borderTop: "1px dashed #ddd", margin: "8px 0" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Tổng cộng:</span>
              <span style={{ textAlign: "right", fontWeight: 700, fontSize: 18, color: "#1677ff" }}>
                {tongTien.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          {/* Số tiền thực trả */}
          <div style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>💰 Số tiền khách trả:</label>
            <Input
              type="number" min={0} max={tongTien}
              value={soTienTra}
              onChange={(e) => setSoTienTra(e.target.value)}
              suffix="đ"
              placeholder={`Tối đa ${tongTien.toLocaleString("vi-VN")} đ`}
            />
            {soTienNum > 0 && soTienNum < tongTien && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "#fff7e6", borderRadius: 8, fontSize: 13, color: "#d46b08" }}>
                ⚠️ Trả thiếu <b>{(tongTien - soTienNum).toLocaleString("vi-VN")} đ</b> → phần này sẽ ghi vào <b>dư nợ</b> tài khoản.
              </div>
            )}
            {soTienNum >= tongTien && tongTien > 0 && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "#f6ffed", borderRadius: 8, fontSize: 13, color: "#389e0d" }}>
                ✅ Thanh toán đủ.
              </div>
            )}
          </div>

          {/* Hình thức thanh toán */}
          <div style={{ marginTop: 14 }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>
              <WalletOutlined style={{ marginRight: 6 }} />Hình thức thanh toán:
            </label>
            <Select
              value={hinhThuc}
              onChange={(v) => setHinhThuc(v)}
              style={{ width: "100%" }}
              options={PAYMENT_METHODS.map((m) => ({ value: m.value, label: m.label }))}
            />
          </div>

          {/* QR khi chọn phương thức online */}
          {showQR && (
            <div style={styles.qrBox}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: "#1677ff" }}>
                <QrcodeOutlined style={{ marginRight: 6 }} />Quét mã để thanh toán
              </div>
              <img
                src={buildQR(soTienNum, `Tra sach ${thanhToanPhieu?.maPhieuMuon}`)}
                alt="QR thanh toán"
                style={{ width: 200, height: 200, borderRadius: 8, border: "1px solid #e0e0e0" }}
              />
              <div style={{ marginTop: 10, fontSize: 13, color: "#555" }}>
                <div>Ngân hàng: <b>MB Bank</b></div>
                <div>STK: <b>{BANK_ACCOUNT}</b></div>
                <div>Số tiền: <b style={{ color: "#1677ff" }}>{soTienNum.toLocaleString("vi-VN")} đ</b></div>
                <div>Nội dung: <b>Tra sach {thanhToanPhieu?.maPhieuMuon}</b></div>
              </div>
              <div style={{ marginTop: 10, padding: "8px 14px", background: "#e6f4ff", borderRadius: 8, fontSize: 12, color: "#555" }}>
                Sau khi chuyển khoản thành công, bấm <b>Xác nhận thanh toán</b> để hoàn tất.
              </div>
            </div>
          )}

          {/* Ghi chú */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>
              <FileTextOutlined style={{ marginRight: 6 }} />Ghi chú (tuỳ chọn):
            </label>
            <Input.TextArea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="Thêm ghi chú..."
              rows={2}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onCancel} style={styles.btnCancel}>Hủy</button>
            <button
              onClick={onConfirm}
              disabled={thanhToanLoading || soTienNum <= 0}
              style={{ ...styles.btnConfirmPay, opacity: soTienNum <= 0 ? 0.5 : 1 }}
            >
              {thanhToanLoading ? <Spin size="small" /> : <><CreditCardOutlined /> Xác nhận thanh toán</>}
            </button>
          </div>
        </div>
      )}

      {/* Bước 2: Hoàn tất */}
      {thanhToanStep === 2 && (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
          <h3 style={{ color: "#52c41a", marginBottom: 8 }}>Thanh toán thành công!</h3>
          <p style={{ color: "#666" }}>Sách đã được trả. Cảm ơn bạn đã sử dụng thư viện!</p>
          {thanhToanResult?.maThanhToan && (
            <p style={{ color: "#888", fontSize: 13 }}>Mã thanh toán: <b>{thanhToanResult.maThanhToan}</b></p>
          )}
          {Number(thanhToanResult?.duNoThem) > 0 && (
            <div style={{ margin: "12px auto", maxWidth: 320, padding: "12px 16px", background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 10, fontSize: 14 }}>
              ⚠️ Còn dư nợ <b style={{ color: "#d46b08" }}>{Number(thanhToanResult.duNoThem).toLocaleString("vi-VN")} đ</b> chưa thanh toán.
              Tổng dư nợ tài khoản: <b style={{ color: "#d46b08" }}>{Number(thanhToanResult.tongDuNo).toLocaleString("vi-VN")} đ</b>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            {thanhToanResult?.maThanhToan && (
              <button onClick={() => onXuatHoaDon(thanhToanResult.maThanhToan)} style={styles.btnDownload}>
                <FileTextOutlined /> Tải hóa đơn PDF
              </button>
            )}
            <button onClick={onCancel} style={styles.btnPrimary}>Đóng</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ThanhToanModal;