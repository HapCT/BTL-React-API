import React from "react";
import { Table, Button } from "antd";

const BanDocTable = ({ data, onEdit, onDelete }) => {
  return (
    <Table
      dataSource={data}
      rowKey="maBanDoc"
      columns={[
        { title: "Mã", dataIndex: "maBanDoc" },
        { title: "Họ tên", dataIndex: "hoTen" },
        { title: "SĐT", dataIndex: "email" },
        { title: "Hạn thẻ", dataIndex: "hanThe" },
        { title: "Email", dataIndex: "soDienThoai" },
        { title: "Trạng thái", dataIndex: "trangThaiThe" },
        { title: "Dư nợ", dataIndex: "duNo" },
        { title: "CCCD", dataIndex: "cccd" },
        {
          title: "Hành động",
          render: (_, record) => (
            <>
              <Button onClick={() => onEdit(record)} style={{marginRight: '5px'}}>Sửa</Button>
              <Button danger onClick={() => onDelete(record.maBanDoc)}>
                Xóa
              </Button>
            </>
          ),
        },
      ]}
    />
  );
};

export default BanDocTable;