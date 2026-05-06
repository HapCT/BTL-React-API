import React from "react";
import { Table, Button } from "antd";

const SachTable = ({ data, onEdit, onDelete }) => {
  return (
    <Table
      dataSource={data}
      rowKey="maBanSao"
      columns={[
        { title: "Mã", dataIndex: "maBanSao" },
        { title: "Mã sách", dataIndex: "maSach" },
        { title: "Tiêu đề", dataIndex: "tieuDe" },
        { title: "Mã kệ", dataIndex: "maKe" },
        { title: "Tên kệ", dataIndex: "tenKe" },
        { title: "Trạng thái", dataIndex: "trangThai" },
        {
          title: "Hành động",
          render: (_, record) => (
            <>
              <Button onClick={() => onEdit(record)} style={{marginRight: '5px'}}>Sửa</Button>
              <Button danger onClick={() => onDelete(record.maBanSao)}>
                Xóa
              </Button>
            </>
          ),
        },
      ]}
    />
  );
};

export default SachTable;