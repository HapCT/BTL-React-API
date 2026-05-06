import React from "react";
import { Modal, Input } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const GiaHanModal = ({ open, selectedPhieu, soNgayGiaHan, setSoNgayGiaHan, loading, onOk, onCancel }) => {
  return (
    <Modal
      open={open}
      title={<span><ReloadOutlined style={{ marginRight: 8, color: "#fa8c16" }} />Gia hạn phiếu mượn</span>}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận gia hạn"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      {selectedPhieu && (
        <div>
          <p>📖 <b>{selectedPhieu.tenSach || `Sách #${selectedPhieu.maSach}`}</b></p>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
            Hạn trả hiện tại: {selectedPhieu.hanTra ? new Date(selectedPhieu.hanTra).toLocaleDateString("vi-VN") : "—"}
          </p>
          <label style={{ fontWeight: 500 }}>Số ngày gia hạn thêm (1–30):</label>
          <Input
            type="number" min={1} max={30}
            value={soNgayGiaHan}
            onChange={(e) => setSoNgayGiaHan(Number(e.target.value))}
            suffix="ngày"
            style={{ marginTop: 8 }}
          />
          {soNgayGiaHan > 0 && selectedPhieu.hanTra && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#e6f4ff", borderRadius: 8, fontSize: 13 }}>
              📅 Hạn trả mới:{" "}
              <b>
                {new Date(new Date(selectedPhieu.hanTra).getTime() + soNgayGiaHan * 86400000).toLocaleDateString("vi-VN")}
              </b>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default GiaHanModal;