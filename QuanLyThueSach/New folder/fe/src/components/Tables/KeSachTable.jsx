import React from "react";
import { Table, Button } from "antd";

const TheLoaiTable = ({ data, onEdit, onDelete }) => {
  return (
    <Table
      dataSource={data}
      rowKey="maKe"
      columns={[
        { title: "Mã", dataIndex: "maKe" },
        { title: "Tên kệ", dataIndex: "tenKe" },
        { title: "Vị trí", dataIndex: "viTri" },
        {
            title: "Hành động",
            render: (_, record) => (
                <>
                <Button onClick={() => onEdit(record)} style={{marginRight: '5px'}}>Sửa</Button>
              <Button danger onClick={() => onDelete(record.maKe)}>
                Xóa
              </Button>
            </>
          ),
        },
      ]}
    />
  );
};

export default TheLoaiTable;
        
        