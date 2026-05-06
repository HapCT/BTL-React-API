import React from "react";
import { Table, Button, Tag } from "antd";

const DatChoTable = ({ data, loading, onHuy, onDuyet }) => {
  const columns = [
    {
      title: "Mã",
      dataIndex: "maDatCho"
    },
    {
      title: "Sách",
      dataIndex: "tieuDe"
    },
    {
      title: "Bạn đọc",
      dataIndex: "hoTen"
    },
    {
      title: "Thứ tự",
      dataIndex: "thuTu"
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (text) => {
        let color = "blue";
        if (text === "Đang chờ") color = "orange";
        if (text === "Đã xử lý") color = "green";
        if (text === "Huỷ") color = "red";

        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Hành động",
      render: (_, record) =>
        record.trangThai === "Đang chờ" && (
          <>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => onDuyet(record.maSach)}
            >
              Duyệt
            </Button>

            <Button danger onClick={() => onHuy(record.maDatCho)}>
              Hủy
            </Button>
          </>
        )
    }
  ];

  return (
    <Table
      rowKey="maDatCho"
      columns={columns}
      dataSource={data}
      loading={loading}
    />
  );
};

export default DatChoTable;