import {
  BookOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, ClockCircleOutlined,
} from "@ant-design/icons";
import React from "react";

export const STATUS_COLOR = {
  "Đang mượn": "blue", "Đã trả": "green",
  "Quá hạn": "red", "Chờ duyệt": "orange", "Đã hủy": "default",
};

export const STATUS_ICON = {
  "Đang mượn": <BookOutlined />, "Đã trả": <CheckCircleOutlined />,
  "Quá hạn": <ExclamationCircleOutlined />, "Chờ duyệt": <ClockCircleOutlined />,
};

export const PAYMENT_METHODS = [
  { value: "Tiền mặt",      label: "💵 Tiền mặt" },
  { value: "Chuyển khoản",  label: "🏦 Chuyển khoản / QR ngân hàng" },
  { value: "MoMo",          label: "📱 Ví MoMo" },
  { value: "ZaloPay",       label: "💙 ZaloPay" },
  { value: "Thẻ ngân hàng", label: "💳 Thẻ ngân hàng" },
];

// Cấu hình QR — chỉnh bank / account / name cho đúng thư viện
const BANK_ID   = "970422"; // MB Bank (VietQR bankId)
const ACCOUNT   = "0396830322";
const ACCT_NAME = "Nhà sách Huy Anh";

export const buildQR = (amount, info) =>
  `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT}-compact2.png` +
  `?amount=${Math.round(amount)}&addInfo=${encodeURIComponent(info)}&accountName=${encodeURIComponent(ACCT_NAME)}`;

export const BANK_ACCOUNT = ACCOUNT;

export const isOnlineMethod = (m) => ["Chuyển khoản", "MoMo", "ZaloPay"].includes(m);