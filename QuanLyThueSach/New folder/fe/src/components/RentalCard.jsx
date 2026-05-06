import React from "react";
import { Tag } from "antd";
import { CalendarOutlined, ClockCircleOutlined, CreditCardOutlined, ReloadOutlined } from "@ant-design/icons";
import { STATUS_COLOR, STATUS_ICON } from "../constant/RentalsConstants ";
import styles from "../assets/css/Rentalsstyles";

const RentalCard = ({ pm, onThanhToan, onGiaHan, onHuy }) => {
  const borderColor =
    pm.trangThai === "Quá hạn"  ? "#ff4d4f" :
    pm.trangThai === "Đang mượn" ? "#1677ff" :
    pm.trangThai === "Chờ duyệt" ? "#fa8c16" : "#d9d9d9";

  return (
    <div
      key={pm.maPhieuMuon}
      style={{ ...styles.card, borderLeft: `4px solid ${borderColor}`, background: pm.trangThai === "Quá hạn" ? "#fff8f8" : "#fff" }}
    >
      <div style={styles.cardBody}>
        <div style={{ flex: 1 }}>
          <div style={styles.bookTitle}>📖 {pm.tenSach || pm.tieuDe || `Sách #${pm.maSach}`}</div>
          <div style={styles.cardMeta}>
            <span><b>Mã phiếu:</b> {pm.maPhieuMuon}</span>
            <span>
              <CalendarOutlined style={{ marginRight: 4 }} />
              <b>Ngày mượn:</b> {pm.ngayMuon ? new Date(pm.ngayMuon).toLocaleDateString("vi-VN") : "—"}
            </span>
            <span>
              <ClockCircleOutlined style={{ marginRight: 4, color: pm.trangThai === "Quá hạn" ? "#ff4d4f" : "inherit" }} />
              <b>Hạn trả:</b>{" "}
              <span style={{ color: pm.trangThai === "Quá hạn" ? "#ff4d4f" : "inherit", fontWeight: 600 }}>
                {pm.hanTra
                  ? new Date(pm.hanTra).toLocaleDateString("vi-VN")
                  : pm.ngayTraDuKien
                    ? new Date(pm.ngayTraDuKien).toLocaleDateString("vi-VN")
                    : "—"}
              </span>
            </span>
            {pm.soLanGiaHan > 0 && (
              <span style={{ color: "#fa8c16" }}>🔄 Đã gia hạn: <b>{pm.soLanGiaHan} lần</b></span>
            )}
          </div>
          {pm.trangThai === "Quá hạn" && (
            <div style={styles.overdueAlert}>⚠️ Sách đã quá hạn! Vui lòng trả sách và thanh toán phí phạt.</div>
          )}
        </div>

        <div style={styles.cardActions}>
          <Tag
            color={STATUS_COLOR[pm.trangThai] || "default"}
            icon={STATUS_ICON[pm.trangThai]}
            style={{ fontSize: 13, padding: "4px 12px", borderRadius: 20 }}
          >
            {pm.trangThai}
          </Tag>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {(pm.trangThai === "Đang mượn" || pm.trangThai === "Quá hạn") && (
              <button onClick={() => onThanhToan(pm)} style={styles.btnPayment}>
                <CreditCardOutlined /> Thanh toán &amp; Trả sách
              </button>
            )}
            {pm.trangThai === "Đang mượn" && (
              <button onClick={() => onGiaHan(pm)} style={styles.btnGiaHan}>
                <ReloadOutlined /> Gia hạn
              </button>
            )}
            {pm.trangThai === "Chờ duyệt" && (
              <button onClick={() => onHuy(pm.maPhieuMuon)} style={styles.btnHuy}>Hủy phiếu</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;