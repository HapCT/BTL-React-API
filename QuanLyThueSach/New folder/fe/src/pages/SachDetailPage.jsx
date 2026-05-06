import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Modal, Input, Rate, Spin, Tag, Divider } from "antd";
import {
    BookOutlined,
    UserOutlined,
    CalendarOutlined,
    GlobalOutlined,
    CopyOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import { getSachDetail } from "../services/SachService";
import { createDatCho } from "../services/DatChoService";
import { dangKyMuon } from "../services/PhieuMuonService";
import { getUser } from "../utils/Auth";

const API_BASE = "https://localhost:44352";

const SachDetailPage = () => {
    const { maSach } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalMuon, setModalMuon] = useState(false);
    const [soNgay, setSoNgay] = useState(7);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSachDetail(maSach)
            .then((res) => setBook(res.data?.data || res.data))
            .catch(() => message.error("Không tìm thấy sách"))
            .finally(() => setLoading(false));
    }, [maSach]);

    const getImgSrc = (img) => {
        if (!img) return "https://via.placeholder.com/260x360?text=No+Image";
        return img.startsWith("http") ? img : `${API_BASE}${img}`;
    };

    const handleDatCho = async () => {
        const user = getUser();
        if (!user) { navigate("/login"); return; }
        try {
            await createDatCho({ maSach, maBanDoc: user.maBanDoc });
            message.success("Đặt chỗ thành công! Chúng tôi sẽ liên hệ bạn.");
        } catch (err) {
            message.error(err.response?.data?.message || "Lỗi đặt chỗ");
        }
    };

    const handleMuon = async () => {
        const user = getUser();
        if (!user) { navigate("/login"); return; }
        if (soNgay < 1 || soNgay > 30) {
            message.warning("Số ngày mượn phải từ 1 đến 30 ngày");
            return;
        }
        setSubmitting(true);
        try {
            await dangKyMuon({ maSach, maBanDoc: user.maBanDoc, soNgayMuon: soNgay });
            message.success("Đăng ký mượn thành công! Vui lòng đến thư viện nhận sách.");
            setModalMuon(false);
        } catch (err) {
            message.error(err.response?.data?.message || "Lỗi đăng ký mượn");
        } finally {
            setSubmitting(false);
        }
    };

    const soLuong = book?.soLuongSach ?? 0;
    const conSach = soLuong > 0;

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spin size="large" tip="Đang tải thông tin sách..." />
        </div>
    );

    if (!book) return (
        <>
            <HeaderUser />
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <CloseCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
                <h2 style={{ color: "#555" }}>Không tìm thấy sách</h2>
                <button onClick={() => navigate(-1)} style={styles.btnBack}>← Quay lại</button>
            </div>
            <FooterUser />
        </>
    );

    return (
        <>
            <HeaderUser />
            <div style={styles.page}>

                {/* Breadcrumb / Back */}
                <button onClick={() => navigate(-1)} style={styles.btnBack}>
                    <ArrowLeftOutlined /> Quay lại
                </button>

                <div style={styles.card}>
                    {/* LEFT: Ảnh bìa */}
                    <div style={styles.imgCol}>
                        <img
                            src={getImgSrc(book.hinhAnh)}
                            alt={book.tieuDe}
                            style={styles.img}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/260x360?text=No+Image"; }}
                        />

                        {/* Trạng thái sách */}
                        <div style={{ marginTop: 16, textAlign: "center" }}>
                            {conSach ? (
                                <span style={styles.badgeAvail}>
                                    <CheckCircleOutlined /> Còn sách ({soLuong} bản)
                                </span>
                            ) : (
                                <span style={styles.badgeNone}>
                                    <CloseCircleOutlined /> Hết sách
                                </span>
                            )}
                        </div>

                        {/* Nút hành động */}
                        <div style={styles.actionCol}>
                            <button
                                onClick={() => { if (!conSach) { message.warning("Sách hiện đã hết, vui lòng đặt chỗ"); return; } setModalMuon(true); }}
                                style={{ ...styles.btnPrimary, opacity: conSach ? 1 : 0.6 }}
                            >
                                <BookOutlined /> Đăng ký mượn
                            </button>
                            <button onClick={handleDatCho} style={styles.btnOutline}>
                                🔖 Đặt chỗ
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Thông tin */}
                    <div style={styles.infoCol}>
                        <h1 style={styles.title}>{book.tieuDe}</h1>

                        {/* Thể loại tags */}
                        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {book.danhSachTheLoai
                                ? book.danhSachTheLoai.split(",").map((tl, i) => {
                                    const ten = tl.includes(":") ? tl.split(":")[1] : tl;
                                    return <Tag key={i} color="blue">{ten.trim()}</Tag>;
                                })
                                : book.theLoaiList?.map((tl) => (
                                    <Tag key={tl.maTheLoai} color="blue">{tl.tenTheLoai}</Tag>
                                ))}
                        </div>

                        <Divider />

                        {/* Thông tin chi tiết dạng grid */}
                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <span style={styles.infoIcon}><UserOutlined /></span>
                                <div>
                                    <div style={styles.infoLabel}>Tác giả</div>
                                    <div style={styles.infoValue}>{book.tacGia || "—"}</div>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoIcon}><CalendarOutlined /></span>
                                <div>
                                    <div style={styles.infoLabel}>Năm xuất bản</div>
                                    <div style={styles.infoValue}>{book.namXB || "—"}</div>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoIcon}><GlobalOutlined /></span>
                                <div>
                                    <div style={styles.infoLabel}>Ngôn ngữ</div>
                                    <div style={styles.infoValue}>{book.ngonNgu || "—"}</div>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoIcon}><CopyOutlined /></span>
                                <div>
                                    <div style={styles.infoLabel}>Số lượng bản sao</div>
                                    <div style={styles.infoValue}>{soLuong} bản</div>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        {/* Chính sách mượn */}
                        <div style={styles.policy}>
                            <h4 style={{ marginBottom: 10, color: "#444" }}>📋 Chính sách mượn sách</h4>
                            <ul style={{ paddingLeft: 20, color: "#666", lineHeight: 2, margin: 0 }}>
                                <li>Mượn tối đa <b>30 ngày</b> mỗi lần</li>
                                <li>Phí thuê: <b>1.500 đ/ngày</b></li>
                                <li>Phí trễ hạn: <b>5.000 đ/ngày</b></li>
                                <li>Có thể gia hạn nếu không có người đặt chỗ</li>
                                <li>Đặt chỗ giữ tối đa <b>2 ngày</b></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal đăng ký mượn */}
            <Modal
                open={modalMuon}
                title={<span><BookOutlined style={{ marginRight: 8 }} />Đăng ký mượn sách</span>}
                onOk={handleMuon}
                onCancel={() => setModalMuon(false)}
                okText="Xác nhận mượn"
                cancelText="Hủy"
                confirmLoading={submitting}
                okButtonProps={{ style: { background: "#1677ff" } }}
            >
                <div style={{ padding: "8px 0" }}>
                    <p style={{ marginBottom: 4 }}>📖 Sách: <b>{book.tieuDe}</b></p>
                    <p style={{ marginBottom: 16, color: "#888" }}>✍️ Tác giả: {book.tacGia}</p>

                    <label style={{ fontWeight: 500 }}>
                        <ClockCircleOutlined style={{ marginRight: 6 }} />
                        Số ngày mượn (1 - 30 ngày):
                    </label>
                    <Input
                        type="number"
                        min={1}
                        max={30}
                        value={soNgay}
                        onChange={(e) => setSoNgay(Number(e.target.value))}
                        style={{ marginTop: 8 }}
                        suffix="ngày"
                    />

                    {soNgay > 0 && (
                        <div style={{ marginTop: 12, padding: "10px 14px", background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8 }}>
                            <p style={{ margin: 0, color: "#52c41a" }}>
                                💰 Dự kiến phí thuê: <b>{(soNgay * 1500).toLocaleString("vi-VN")} đ</b>
                            </p>
                        </div>
                    )}
                </div>
            </Modal>

            <FooterUser />
        </>
    );
};

const styles = {
    page: {
        maxWidth: 1000,
        margin: "0 auto",
        padding: "28px 16px 48px",
    },
    btnBack: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#1677ff",
        fontSize: 14,
        marginBottom: 20,
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    card: {
        display: "flex",
        gap: 40,
        flexWrap: "wrap",
        background: "#fff",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    },
    imgCol: {
        flexShrink: 0,
        width: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    img: {
        width: 260,
        height: 360,
        objectFit: "cover",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    },
    badgeAvail: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#f6ffed",
        color: "#52c41a",
        border: "1px solid #b7eb8f",
        borderRadius: 20,
        padding: "4px 14px",
        fontSize: 13,
        fontWeight: 500,
    },
    badgeNone: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#fff2f0",
        color: "#ff4d4f",
        border: "1px solid #ffccc7",
        borderRadius: 20,
        padding: "4px 14px",
        fontSize: 13,
        fontWeight: 500,
    },
    actionCol: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
    },
    btnPrimary: {
        width: "100%",
        padding: "11px 0",
        background: "#1677ff",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background 0.2s",
    },
    btnOutline: {
        width: "100%",
        padding: "11px 0",
        background: "#fff",
        color: "#1677ff",
        border: "2px solid #1677ff",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 15,
        transition: "all 0.2s",
    },
    infoCol: {
        flex: 1,
        minWidth: 260,
    },
    title: {
        fontSize: 26,
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: 12,
        lineHeight: 1.4,
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        margin: "4px 0",
    },
    infoItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
    },
    infoIcon: {
        fontSize: 18,
        color: "#1677ff",
        marginTop: 2,
    },
    infoLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: 600,
        color: "#222",
    },
    policy: {
        background: "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 10,
        padding: "14px 18px",
        marginTop: 4,
    },
};

export default SachDetailPage;