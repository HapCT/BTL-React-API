import React from "react";
import { Table, Button, Tag, Image } from "antd";

const API_BASE = "https://localhost:44352";

const SachTable = ({ data, onEdit, onDelete }) => {
  return (
    <Table
      dataSource={data}
      rowKey="maSach"
      scroll={{ x: true }}
      columns={[
        { title: "Mã", dataIndex: "maSach", width: 70 },
        { title: "Tên sách", dataIndex: "tieuDe" },
        { title: "Tác giả", dataIndex: "tacGia" },
        {
          title: "Thể loại",
          dataIndex: "theLoaiList",
          render: (theLoaiList, record) => {
            // ✅ FIX: hiển thị nhiều thể loại
            if (theLoaiList && theLoaiList.length > 0) {
              return theLoaiList.map((tl) => (
                <Tag color="blue" key={tl.maTheLoai || tl}>
                  {tl.tenTheLoai || tl}
                </Tag>
              ));
            }
            // fallback nếu backend trả về 1 thể loại
            if (record.tenTheLoai) {
              return <Tag color="blue">{record.tenTheLoai}</Tag>;
            }
            return <span style={{ color: "#bbb" }}>—</span>;
          },
        },
        { title: "Năm XB", dataIndex: "namXB", width: 90 },
        { title: "Ngôn ngữ", dataIndex: "ngonNgu", width: 100 },
        { title: "Số lượng", dataIndex: "soLuongSach", width: 90 },
        {
          title: "Ảnh",
          dataIndex: "hinhAnh",
          width: 90,
          render: (img) => {
            if (!img) return <span style={{ color: "#bbb" }}>Không có</span>;
            // ✅ FIX: xử lý URL ảnh đúng
            const src = img.startsWith("http") ? img : `${API_BASE}${img}`;
            return (
              <Image
                src={src}
                width={60}
                height={80}
                style={{ objectFit: "cover", borderRadius: 4 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              />
            );
          },
        },
        {
          title: "Hành động",
          width: 140,
          render: (_, record) => (
            <>
              <Button
                onClick={() => onEdit(record)}
                style={{ marginRight: "5px" }}
              >
                Sửa
              </Button>
              <Button danger onClick={() => onDelete(record.maSach)}>
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