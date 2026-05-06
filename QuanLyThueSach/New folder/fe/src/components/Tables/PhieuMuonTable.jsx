import React from "react";
import { Table, Button, Tag, Space } from "antd";

const PhieuMuonTable = ({ data, onDuyet, onTra, onGiaHan, onHuy }) => {
  const columns = [
    { title: "Mã", dataIndex: "maPhieuMuon" },
    { title: "Bạn đọc", dataIndex: "tenBanDoc" },
    { title: "Sách", dataIndex: "tenSach" },
    { title: "Ngày mượn", dataIndex: "ngayMuon" },
    { title: "Hạn trả", dataIndex: "hanTra" },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text) => {
        let color = "blue";
        if (text === "Đăng ký mượn") color = "orange";
        if (text === "Đã nhận sách") color = "green";
        if (text === "Quá hạn") color = "red";
        if (text === "Đã trả") color = "default";

        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          {record.trangThai === "Đăng ký mượn" && (
            <>
              <Button type="primary" onClick={() => onDuyet(record.maPhieuMuon)}>
                Duyệt
              </Button>
              <Button danger onClick={() => onHuy(record.maPhieuMuon)}>
                Huỷ
              </Button>
            </>
          )}

          {(record.trangThai === "Đã nhận sách" || record.trangThai === "Quá hạn" || record.trangThai === "Đang mượn") && (
            <>
              <Button onClick={() => onTra(record.maPhieuMuon)}>
                Trả
              </Button>
              <Button onClick={() => onGiaHan(record.maPhieuMuon)}>
                Gia hạn
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return <Table rowKey="maPhieuMuon" columns={columns} dataSource={data} />;
};

export default PhieuMuonTable;