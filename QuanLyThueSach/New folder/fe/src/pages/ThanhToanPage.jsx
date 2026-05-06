import React, { useEffect, useState, useRef } from "react";
import { Table, Spin, Input, DatePicker, Space, Tag, Button, Statistic, Row, Col, Card } from "antd";
import { SearchOutlined, PrinterOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getThanhToans } from "../services/ThanhToanService";
import { printHoaDon } from "../utils/print";

const { RangePicker } = DatePicker;

function ThanhToanPage() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getThanhToans();
            const list = Array.isArray(res.data) ? res.data
                : Array.isArray(res.data?.data) ? res.data.data : [];
            setData(list);
            setFiltered(list);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // filter khi search hoặc date thay đổi
    useEffect(() => {
        let result = [...data];
        if (search.trim()) {
            const kw = search.toLowerCase();
            result = result.filter(d =>
                d.maThanhToan?.toLowerCase().includes(kw) ||
                d.tenBanDoc?.toLowerCase().includes(kw) ||
                d.hinhThucThanhToan?.toLowerCase().includes(kw)
            );
        }
        if (dateRange?.[0] && dateRange?.[1]) {
            result = result.filter(d => {
                const ngay = dayjs(d.ngayThanhToan);
                return ngay.isAfter(dateRange[0].startOf("day").subtract(1, "ms")) &&
                    ngay.isBefore(dateRange[1].endOf("day"));
            });
        }
        setFiltered(result);
    }, [search, dateRange, data]);

    const tongTien = filtered.reduce((s, d) => s + Number(d.soTien || 0), 0);

    const columns = [
        { title: "Mã TT", dataIndex: "maThanhToan", width: 130 },
        { title: "Bạn đọc", dataIndex: "tenBanDoc" },
        { title: "SĐT", dataIndex: "soDienThoai", width: 120 },
        {
            title: "Ngày TT", dataIndex: "ngayThanhToan", width: 130,
            render: v => v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—",
            sorter: (a, b) => dayjs(a.ngayThanhToan).unix() - dayjs(b.ngayThanhToan).unix(),
            defaultSortOrder: "descend"
        },
        {
            title: "Số tiền", dataIndex: "soTien", width: 130,
            render: v => <b style={{ color: "#1677ff" }}>{Number(v || 0).toLocaleString("vi-VN")} đ</b>,
            sorter: (a, b) => a.soTien - b.soTien
        },
        {
            title: "Hình thức", dataIndex: "hinhThucThanhToan", width: 120,
            render: v => <Tag color={v === "Tiền mặt" ? "green" : "blue"}>{v}</Tag>
        },
        {
            title: "Trạng thái", dataIndex: "trangThai", width: 120,
            render: v => <Tag color={v === "Đã thanh toán" ? "green" : "red"}>{v || "Đã thanh toán"}</Tag>
        },
        {
            title: "In HĐ", width: 80,
            render: (_, r) => (
                <Button size="small" icon={<PrinterOutlined />} onClick={() => printHoaDon(r)}>
                    In
                </Button>
            )
        }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>Quản lý thanh toán</h2>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Tổng giao dịch hiển thị"
                            value={filtered.length}
                            suffix="giao dịch"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Tổng tiền hiển thị"
                            value={tongTien}
                            formatter={v => `${Number(v).toLocaleString("vi-VN")} đ`}
                            valueStyle={{ color: "#1677ff" }}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Space style={{ marginBottom: 16 }} wrap>
                <Input
                    placeholder="Tìm mã TT, tên bạn đọc..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: 260 }}
                    allowClear
                />
                <RangePicker
                    placeholder={["Từ ngày", "Đến ngày"]}
                    format="DD/MM/YYYY"
                    onChange={setDateRange}
                />
                <Button onClick={fetchData}>Làm mới</Button>
            </Space>

            {loading ? <Spin size="large" /> : (
                <Table
                    dataSource={filtered}
                    rowKey="maThanhToan"
                    columns={columns}
                    pagination={{ pageSize: 6, showTotal: (t) => `Tổng ${t} bản ghi` }}
                    scroll={{ x: 900 }}
                />
            )}
        </div>
    );
}

export default ThanhToanPage;