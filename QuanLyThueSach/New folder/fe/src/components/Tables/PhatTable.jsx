import React from "react";
import { Table, Tag, Button, Popconfirm } from "antd";

function PhatTable({ data, onHuy }) {
  const renderTrangThai = (text) => {
    if (text === "Chưa thanh toán") return <Tag color="orange">{text}</Tag>;
    if (text === "Đã thanh toán") return <Tag color="green">{text}</Tag>;
    if (text === "Đã huỷ") return <Tag color="red">{text}</Tag>;
  };

  const columns = [
    { title: "Mã phạt", dataIndex: "maPhat" },
    { title: "Mã phiếu", dataIndex: "maPhieuMuon" },
    { title: "Tên bạn đọc", dataIndex: "tenBanDoc" },
    { title: "Tên sách", dataIndex: "tenSach" },
    { title: "Số tiền", dataIndex: "soTien" },
    { title: "Lý do", dataIndex: "lyDoPhat" },
    { title: "Ngày", dataIndex: "ngayTinh" },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: renderTrangThai,
    },
    {
      title: "Hành động",
      render: (_, record) =>
        record.trangThai === "Chưa thanh toán" && (
          <Popconfirm
            title="Huỷ phạt?"
            onConfirm={() => onHuy(record.maPhat)}
          >
            <Button danger>Huỷ</Button>
          </Popconfirm>
        ),
    },
  ];

  return <Table rowKey="maPhat" dataSource={data} columns={columns} />;
}

export default PhatTable;