import React from "react";
import { Table, Button, Tag, Tooltip, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const HoaDonNhapTable = ({ data, onEdit, onDelete, onView }) => {
  const columns = [
    {
      title: "Mã HĐ",
      dataIndex: "maHoaDonNhap",
      width: 110,
      render: (v) => <span style={{ fontFamily: "monospace" }}>{v}</span>,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "nhaCungCap",
      ellipsis: true,
    },
    {
      title: "Người nhập",
      dataIndex: "nguoiNhap",
      width: 140,
      ellipsis: true,
      render: (v) => v || <span style={{ color: "#bbb" }}>—</span>,
    },
    {
      title: "Ngày nhập",
      dataIndex: "ngayNhap",
      width: 120,
      render: (v) =>
        v ? dayjs(v).format("DD/MM/YYYY") : <span style={{ color: "#bbb" }}>—</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      width: 140,
      align: "right",
      render: (v) => (
        <span style={{ fontWeight: 600, color: "#1677ff" }}>
          {Number(v || 0).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Số dòng sách",
      dataIndex: "soSach",
      width: 110,
      align: "center",
      render: (v, record) => {
        const count = v ?? record.chiTiet?.length ?? 0;
        return <Tag color="blue">{count} loại</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "ghiChu",
      ellipsis: true,
      render: (v) => v || <span style={{ color: "#bbb" }}>—</span>,
    },
    {
      title: "Hành động",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 4 }}>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa hóa đơn này?"
              description="Thao tác không thể hoàn tác."
              onConfirm={() => onDelete(record.maHoaDonNhap)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="maHoaDonNhap"
      scroll={{ x: 900 }}
      pagination={{ pageSize: 10, showSizeChanger: true }}
    />
  );
};

export default HoaDonNhapTable;