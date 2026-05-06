import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Tag, Table } from "antd";
import {
    BookOutlined, UserOutlined, FileTextOutlined,
    WarningOutlined, DollarOutlined, FileProtectOutlined,
} from "@ant-design/icons";
import { getUser } from "../utils/Auth";

const API = "https://localhost:7053/gateway";

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

export default function ThuThuDashboard() {
    const [tongQuan, setTongQuan] = useState({});
    const [phieuMuonMoi, setPhieuMuonMoi] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    useEffect(() => {
        const token = user?.token;
        const headers = { Authorization: `Bearer ${token}` };

        const load = async () => {
            try {
                const [r1, r2] = await Promise.all([
                    fetch(`${API}/ThongKe/tong-quan`, { headers }).then(r => r.json()),
                    fetch(`${API}/PhieuMuon`, { headers }).then(r => r.json()),
                ]);
                setTongQuan(r1?.data || {});
                const list = r2?.data || [];
                setPhieuMuonMoi(list.slice(0, 8));
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
        { title: "Phạt chưa thu", value: `${fmt(tongQuan.phatChuaThu)} đ`, icon: <DollarOutlined />, color: "#eb2f96" },
        { title: "Doanh thu tháng", value: `${fmt(tongQuan.doanhThuThang)} đ`, icon: <FileProtectOutlined />, color: "#722ed1" },
    ];

    const cols = [
        { title: "#", render: (_, __, i) => i + 1, width: 40 },
        { title: "Mã phiếu", dataIndex: "maPhieuMuon", width: 100 },
        { title: "Bạn đọc", dataIndex: "tenBanDoc" },
        { title: "Ngày mượn", dataIndex: "ngayMuon", render: v => v ? new Date(v).toLocaleDateString("vi-VN") : "—" },
        { title: "Hạn trả", dataIndex: "hanTra", render: v => v ? new Date(v).toLocaleDateString("vi-VN") : "—" },
        {
            title: "Trạng thái", dataIndex: "trangThai",
            render: v => {
                const map = { "DangMuon": ["blue", "Đang mượn"], "DaTraa": ["green", "Đã trả"], "QuaHan": ["red", "Quá hạn"] };
                const [color, label] = map[v] || ["default", v];
                return <Tag color={color}>{label}</Tag>;
            }
        },
    ];

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <Spin size="large" tip="Đang tải..." />
        </div>
    );

    return (
        <div style={{ padding: "0 0 32px" }}>
            <h2 style={{ marginBottom: 4, fontSize: 22, fontWeight: 700 }}>
                📋 Trang Thủ Thư
            </h2>
            <p style={{ color: "#888", marginBottom: 24 }}>
                Xin chào, <strong>{user?.hoTen || user?.tenTaiKhoan}</strong>! Đây là tổng quan công việc hôm nay.
            </p>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <Col xs={24} sm={12} md={8} key={i}>
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
                                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value ?? "—"}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card title="📄 Phiếu mượn gần đây" style={{ borderRadius: 12 }}>
                <Table
                    dataSource={phieuMuonMoi}
                    columns={cols}
                    rowKey="maPhieuMuon"
                    pagination={false}
                    size="small"
                    locale={{ emptyText: "Chưa có dữ liệu" }}
                />
            </Card>
        </div>
    );
}
