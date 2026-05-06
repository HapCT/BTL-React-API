import React from "react";
import { Table, Button } from "antd";

const TheLoaiTable = ({ data, onEdit, onDelete }) => {
  return (
    <Table
      dataSource={data}
      rowKey="maTheLoai"
      columns={[
        { title: "Mã", dataIndex: "maTheLoai" },
        { title: "Tên thể loại", dataIndex: "tenTheLoai" },
        { title: "Mô tả", dataIndex: "moTa" },
        {
            title: "Hành động",
            render: (_, record) => (
                <>
                <Button onClick={() => onEdit(record)} style={{marginRight: '5px'}}>Sửa</Button>
              <Button danger onClick={() => onDelete(record.maTheLoai)}>
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
        
        