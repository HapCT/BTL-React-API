import React from "react";
import { Table, Button } from "antd";

const ThanhToanForm = ({ data, onXuat, onIn }) => {
    return (
        <Table
            dataSource={data}
            rowKey="maThanhToan"
            columns={[
                { title: "Mã", dataIndex: "maThanhToan" },
                { title: "Họ tên", dataIndex: "tenBanDoc" },
                { title: "SĐT", dataIndex: "soDienThoai" },
                { title: "Ngày", dataIndex: "ngayThanhToan" },
                { title: "Số tiền", dataIndex: "soTien" },
                { title: "Phương thức", dataIndex: "hinhThucThanhToan" },
                { title: "Ghi chú", dataIndex: "ghiChu" },
                { title: "Trạng thái", dataIndex: "trangThai" },
                {
                    title: "Hành động",
                    render: (_, record) => (
                        <>
                            <Button onClick={() => onIn(record)} style={{ marginLeft: 8 }}>
                                In hóa đơn
                            </Button>
                        </>
                    )
                },
            ]
            }
        />
    )
}

export default ThanhToanForm;