import React, { useEffect, useState, useCallback } from "react";
import { message, Tag, Modal, Tabs, Spin, Badge } from "antd";
import {
  BookOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ExclamationCircleOutlined, ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import { getDatChos, huyDatCho } from "../services/DatChoService";
import { dangKyMuon } from "../services/PhieuMuonService";
import { getUser } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const STATUS_COLOR = {
  "Đang chờ": "orange",
  "Đã xử lý": "green",
  "Huỷ": "red",
  "Hết hạn": "default",
};
const STATUS_ICON = {
  "Đang chờ": <ClockCircleOutlined />,
  "Đã xử lý": <CheckCircleOutlined />,
  "Huỷ": <CloseCircleOutlined />,
};

const CartPage = () => {
  const navigate = useNavigate();
  const [datChos, setDatChos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Modal mượn từ đặt chỗ
  const [muonModal, setMuonModal] = useState(false);
  const [selectedDatCho, setSelectedDatCho] = useState(null);
  const [soNgay, setSoNgay] = useState(7);
  const [muonLoading, setMuonLoading] = useState(false);

  const user = getUser();

  const load = useCallback(async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      const res = await getDatChos();
      const all = res.data?.data || [];
      // Lọc đặt chỗ của user hiện tại
      setDatChos(all.filter((d) => d.maBanDoc === user.maBanDoc || d.hoTen === user.hoTen));
    } catch { message.error("Lỗi tải đặt chỗ"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const handleHuy = (maDatCho) => {
    Modal.confirm({
      title: "Xác nhận hủy đặt chỗ?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Bạn chắc chắn muốn hủy đặt chỗ này không?",
      okText: "Hủy đặt chỗ", cancelText: "Không", okType: "danger",
      onOk: async () => {
        try {
          await huyDatCho(maDatCho);
          message.success("Hủy đặt chỗ thành công");
          load();
        } catch (err) { message.error(err.response?.data?.message || "Lỗi hủy đặt chỗ"); }
      },
    });
  };

  const openMuonModal = (dc) => {
    setSelectedDatCho(dc);
    setSoNgay(7);
    setMuonModal(true);
  };

  const handleMuonNgay = async () => {
    if (!selectedDatCho) return;
    if (soNgay < 1 || soNgay > 30) { message.warning("Số ngày mượn từ 1 đến 30"); return; }
    setMuonLoading(true);
    try {
      await dangKyMuon({
        maSach: selectedDatCho.maSach,
        maBanDoc: user.maBanDoc,
        soNgayMuon: soNgay,
      });
      message.success("Đăng ký mượn thành công! Vui lòng đến thư viện nhận sách.");
      setMuonModal(false);
      load();
    } catch (err) { message.error(err.response?.data?.message || "Lỗi đăng ký mượn"); }
    finally { setMuonLoading(false); }
  };

  const filterByTab = (list) => {
    if (activeTab === "all") return list;
    if (activeTab === "waiting") return list.filter(d => d.trangThai === "Đang chờ");
    if (activeTab === "done") return list.filter(d => ["Đã xử lý", "Huỷ", "Hết hạn"].includes(d.trangThai));
    return list;
  };
  const displayed = filterByTab(datChos);
  const waitingCount = datChos.filter(d => d.trangThai === "Đang chờ").length;

  const tabItems = [
    { key: "all", label: `Tất cả (${datChos.length})` },
    { key: "waiting", label: <span>Đang chờ <Badge count={waitingCount} style={{ marginLeft: 4 }} /></span> },
    { key: "done", label: `Đã xử lý (${datChos.filter(d => ["Đã xử lý", "Huỷ", "Hết hạn"].includes(d.trangThai)).length})` },
  ];

  return (
    <>
      <HeaderUser />
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Đặt chỗ của tôi</h2>
            <p style={styles.pageSubtitle}>
              Khi sách có sẵn, bạn sẽ được thông báo để đến nhận hoặc mượn trực tuyến.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={load} style={styles.btnRefresh}><ReloadOutlined /> Làm mới</button>
            <button onClick={() => navigate("/books")} style={styles.btnPrimary}>
              <PlusOutlined /> Đặt chỗ thêm
            </button>
          </div>
        </div>

        {/* Hướng dẫn */}
        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>Quy trình đặt chỗ</div>
          <div style={styles.infoSteps}>
            {[
              { step: "1", text: "Đặt chỗ khi sách đang hết" },
              { step: "2", text: "Chờ thông báo khi sách có sẵn" },
              { step: "3", text: "Đến nhận trong vòng 2 ngày hoặc mượn online" },
              { step: "4", text: "Nhận sách và mượn về" },
            ].map((s) => (
              <div key={s.step} style={styles.infoStep}>
                <div style={styles.stepNum}>{s.step}</div>
                <div style={{ fontSize: 13, color: "#555" }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        {!loading && datChos.length > 0 && (
          <div style={styles.statsRow}>
            {[
              { label: "Đang chờ", count: datChos.filter(d => d.trangThai === "Đang chờ").length, color: "#fa8c16", bg: "#fff7e6" },
              { label: "Đã xử lý", count: datChos.filter(d => d.trangThai === "Đã xử lý").length, color: "#52c41a", bg: "#f6ffed" },
              { label: "Đã hủy", count: datChos.filter(d => ["Huỷ", "Hết hạn"].includes(d.trangThai)).length, color: "#ff4d4f", bg: "#fff2f0" },
            ].map((s) => (
              <div key={s.label} style={{ ...styles.statCard, background: s.bg, border: `1px solid ${s.color}40` }}>
                <div style={{ ...styles.statNum, color: s.color }}>{s.count}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: 16 }} />

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" tip="Đang tải..." /></div>
        ) : displayed.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: 56, marginBottom: 12 }}></div>
            <h3 style={{ color: "#555" }}>Chưa có đặt chỗ nào</h3>
            <p style={{ color: "#888" }}>Khi sách hết, bạn có thể đặt chỗ để giữ lượt mượn.</p>
            <button onClick={() => navigate("/books")} style={{ ...styles.btnPrimary, marginTop: 12 }}>
              Khám phá sách
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {displayed.map((d) => (
              <div
                key={d.maDatCho}
                style={{
                  ...styles.card,
                  borderLeft: `4px solid ${d.trangThai === "Đang chờ" ? "#fa8c16" : d.trangThai === "Đã xử lý" ? "#52c41a" : "#d9d9d9"}`,
                }}
              >
                <div style={styles.cardBody}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.bookTitle}>
                      {d.tieuDe || `Sách #${d.maSach}`}
                    </div>
                    <div style={styles.cardMeta}>
                      <span><b>Mã đặt chỗ:</b> {d.maDatCho}</span>
                      {d.thuTu && <span>🔢 Thứ tự hàng đợi: <b>{d.thuTu}</b></span>}
                      {d.ngayDatCho && (
                        <span><ClockCircleOutlined style={{ marginRight: 4 }} />
                          Ngày đặt: <b>{new Date(d.ngayDatCho).toLocaleDateString("vi-VN")}</b>
                        </span>
                      )}
                    </div>
                    {d.trangThai === "Đang chờ" && d.thuTu === 1 && (
                      <div style={styles.priorityAlert}>
                        Bạn đang ở đầu hàng đợi! Sách sẽ được dành cho bạn khi có sẵn.
                      </div>
                    )}
                    {d.trangThai === "Đang chờ" && d.thuTu > 1 && (
                      <div style={styles.waitAlert}>
                        Còn <b>{d.thuTu - 1}</b> người phía trước trong hàng đợi.
                      </div>
                    )}
                  </div>
                  <div style={styles.cardActions}>
                    <Tag
                      color={STATUS_COLOR[d.trangThai] || "default"}
                      icon={STATUS_ICON[d.trangThai]}
                      style={{ fontSize: 13, padding: "4px 12px", borderRadius: 20 }}
                    >
                      {d.trangThai}
                    </Tag>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      {d.trangThai === "Đang chờ" && (
                        <>
                          <button onClick={() => openMuonModal(d)} style={styles.btnMuonNgay}>
                            <BookOutlined /> Đăng ký mượn ngay
                          </button>
                          <button onClick={() => handleHuy(d.maDatCho)} style={styles.btnHuy}>
                            Hủy đặt chỗ
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Đăng Ký Mượn từ Đặt Chỗ */}
      <Modal
        open={muonModal}
        title={<span><BookOutlined style={{ marginRight: 8, color: "#1677ff" }} />Đăng ký mượn sách</span>}
        onOk={handleMuonNgay} onCancel={() => setMuonModal(false)}
        okText="Xác nhận mượn" cancelText="Hủy" confirmLoading={muonLoading}
        okButtonProps={{ style: { background: "#1677ff" } }}
      >
        {selectedDatCho && (
          <div>
            <p>📖 <b>{selectedDatCho.tieuDe || `Sách #${selectedDatCho.maSach}`}</b></p>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
              Sau khi xác nhận, phiếu mượn sẽ được tạo và bạn cần đến thư viện nhận sách.
            </p>
            <label style={{ fontWeight: 500 }}>Số ngày mượn (1–30 ngày):</label>
            <input
              type="number" min={1} max={30} value={soNgay}
              onChange={(e) => setSoNgay(Number(e.target.value))}
              style={{ width: "100%", marginTop: 8, padding: "8px 12px", border: "1px solid #d9d9d9", borderRadius: 8, fontSize: 14 }}
            />
            {soNgay > 0 && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8, color: "#52c41a", fontSize: 13 }}>
                Dự kiến phí thuê: <b>{(soNgay * 1500).toLocaleString("vi-VN")} đ</b>
                <span style={{ color: "#888", marginLeft: 8 }}>({soNgay} ngày × 1.500 đ)</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <FooterUser />
    </>
  );
};

const styles = {
  page: { maxWidth: 960, margin: "0 auto", padding: "32px 16px 60px" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 },
  pageTitle: { margin: 0, fontSize: 24, fontWeight: 700 },
  pageSubtitle: { margin: "4px 0 0", color: "#888", fontSize: 14 },
  infoBox: { background: "#f0f7ff", border: "1px solid #bae0ff", borderRadius: 10, padding: "14px 20px", marginBottom: 24 },
  infoTitle: { fontWeight: 600, color: "#1677ff", marginBottom: 12 },
  infoSteps: { display: "flex", gap: 16, flexWrap: "wrap" },
  infoStep: { display: "flex", alignItems: "center", gap: 8 },
  stepNum: { width: 28, height: 28, borderRadius: "50%", background: "#1677ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 },
  statCard: { borderRadius: 10, padding: "14px 16px", textAlign: "center" },
  statNum: { fontSize: 28, fontWeight: 700, lineHeight: 1.2 },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  card: { borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0", background: "#fff" },
  cardBody: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  bookTitle: { fontWeight: 600, fontSize: 15, marginBottom: 8 },
  cardMeta: { display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 13, color: "#666" },
  cardActions: { display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 180 },
  priorityAlert: { marginTop: 10, padding: "8px 12px", background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8, color: "#52c41a", fontSize: 12 },
  waitAlert: { marginTop: 10, padding: "8px 12px", background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 8, color: "#fa8c16", fontSize: 12 },
  emptyBox: { textAlign: "center", padding: 60, color: "#888" },
  btnPrimary: { padding: "9px 20px", background: "#1677ff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 },
  btnRefresh: { padding: "9px 16px", background: "#fff", color: "#555", border: "1px solid #d9d9d9", borderRadius: 8, cursor: "pointer", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 },
  btnMuonNgay: { padding: "8px 14px", background: "#1677ff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" },
  btnHuy: { padding: "7px 14px", background: "#fff", color: "#ff4d4f", border: "1px solid #ff4d4f", borderRadius: 8, cursor: "pointer", fontSize: 13 },
};

export default CartPage;