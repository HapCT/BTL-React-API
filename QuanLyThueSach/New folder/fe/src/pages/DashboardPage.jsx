import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Spin, Tag, Statistic } from "antd";
import {
    BookOutlined, UserOutlined, FileTextOutlined,
    WarningOutlined, DollarOutlined, ExclamationCircleOutlined
} from "@ant-design/icons";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import {
    getTongQuan, getDoanhThu, getSachMuonNhieu,
    getBanDocTichCuc, getThongKeTheLoai
} from "../services/ThongKeService";

const API_BASE = "https://localhost:44352";
const COLORS = ["#1677ff", "#52c41a", "#fa8c16", "#f5222d", "#722ed1", "#13c2c2", "#eb2f96", "#fadb14"];

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

export default function DashboardPage() {
    const [tongQuan, setTongQuan] = useState({});
    const [doanhThu, setDoanhThu] = useState([]);
    const [sachTop, setSachTop] = useState([]);
    const [banDocTop, setBanDocTop] = useState([]);
    const [theLoai, setTheLoai] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [r1, r2, r3, r4, r5] = await Promise.all([
                    getTongQuan(), getDoanhThu(), getSachMuonNhieu(),
                    getBanDocTichCuc(), getThongKeTheLoai()
                ]);
                setTongQuan(r1.data?.data || {});
                setDoanhThu((r2.data?.data || []).map(d => ({
                    name: `T${d.thang}/${d.nam}`,
                    doanhThu: Number(d.doanhThu),
                    soGiaoDich: d.soGiaoDich
                })));
                setSachTop(r3.data?.data || []);
                setBanDocTop(r4.data?.data || []);
                setTheLoai(r5.data?.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = [
        { title: "Tổng sách", value: tongQuan.tongSach, icon: <BookOutlined />, color: "#1677ff" },
        { title: "Bạn đọc", value: tongQuan.tongBanDoc, icon: <UserOutlined />, color: "#52c41a" },
        { title: "Đang mượn", value: tongQuan.dangMuon, icon: <FileTextOutlined />, color: "#fa8c16" },
        { title: "Quá hạn", value: tongQuan.quaHan, icon: <WarningOutlined />, color: "#f5222d" },
        { title: "Doanh thu tháng", value: `${fmt(tongQuan.doanhThuThang)} đ`, icon: <DollarOutlined />, color: "#722ed1" },
        { title: "Phạt chưa thu", value: `${fmt(tongQuan.phatChuaThu)} đ`, icon: <ExclamationCircleOutlined />, color: "#eb2f96" },
    ];

    const sachCols = [
        { title: "#", render: (_, __, i) => i + 1, width: 40 },
        {
            title: "Ảnh", dataIndex: "hinhAnh", width: 56,
            render: (img) => (
                <img
                    src={img ? (img.startsWith("http") ? img : `${API_BASE}${img}`) : "https://via.placeholder.com/40x56?text=?"}
                    style={{ width: 40, height: 56, objectFit: "cover", borderRadius: 4 }}
                />
            )
        },
        { title: "Tên sách", dataIndex: "tieuDe", ellipsis: true },
        { title: "Tác giả", dataIndex: "tacGia", ellipsis: true },
        { title: "Lượt mượn", dataIndex: "soLanMuon", render: v => <Tag color="blue">{v}</Tag>, width: 100 },
    ];

    const banDocCols = [
        { title: "#", render: (_, __, i) => i + 1, width: 40 },
        { title: "Họ tên", dataIndex: "hoTen" },
        { title: "SĐT", dataIndex: "soDienThoai" },
        { title: "Lượt mượn", dataIndex: "soLanMuon", render: v => <Tag color="green">{v}</Tag>, width: 100 },
        {
            title: "Dư nợ", dataIndex: "duNo",
            render: v => v > 0
                ? <span style={{ color: "#f5222d", fontWeight: 600 }}>{fmt(v)} đ</span>
                : <span style={{ color: "#52c41a" }}>0 đ</span>,
            width: 120
        },
    ];

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
    );

    return (
        <div style={{ padding: "0 0 32px" }}>
            <h2 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>
                Tổng quan hệ thống
            </h2>

            {/* STATS CARDS */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <Col xs={24} sm={12} md={8} lg={4} key={i}>
                        <Card bodyStyle={{ padding: "16px 20px" }} style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 10,
                                    background: s.color + "18",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 20, color: s.color, flexShrink: 0
                                }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>{s.title}</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value ?? "—"}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* DOANH THU CHART */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Doanh thu 12 tháng gần nhất" style={{ borderRadius: 12 }}>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={doanhThu} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v) => [`${fmt(v)} đ`, "Doanh thu"]} />
                                <Bar dataKey="doanhThu" fill="#1677ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Phân bổ thể loại" style={{ borderRadius: 12, height: "100%" }}>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={theLoai.slice(0, 8)}
                                    dataKey="soLanMuon"
                                    nameKey="tenTheLoai"
                                    cx="50%" cy="50%"
                                    outerRadius={80}
                                    label={({ tenTheLoai, percent }) =>
                                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                                    }
                                >
                                    {theLoai.slice(0, 8).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} />
                                <Legend
                                    formatter={(v) => v.length > 12 ? v.slice(0, 12) + "..." : v}
                                    iconSize={10}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* TOP SÁCH & BẠN ĐỌC */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card title="Top 10 sách mượn nhiều nhất" style={{ borderRadius: 12 }}>
                        <Table
                            dataSource={sachTop}
                            columns={sachCols}
                            rowKey="maSach"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Top 10 bạn đọc tích cực" style={{ borderRadius: 12 }}>
                        <Table
                            dataSource={banDocTop}
                            columns={banDocCols}
                            rowKey="maBanDoc"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}