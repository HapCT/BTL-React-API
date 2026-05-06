import React, { useEffect, useState, useCallback } from "react";
import { message, Tabs, Spin } from "antd";
import { ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import { getPhieuMuonByBanDoc, huyPhieu, giaHan } from "../services/PhieuMuonService";
import { thanhToan, previewThanhToan, xuatHoaDon } from "../services/ThanhToanService";
import { getUser } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

import RentalCard from "../components/RentalCard";
import GiaHanModal from "../components/GiaHanModal";
import ThanhToanModal from "../components/ThanhToanModal";
import styles from "../assets/css/Rentalsstyles";

const RentalsPage = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [phieuMuons, setPhieuMuons]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState("all");

  // ── Gia hạn ──
  const [giaHanModal, setGiaHanModal]     = useState(false);
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  const [soNgayGiaHan, setSoNgayGiaHan]   = useState(7);
  const [giaHanLoading, setGiaHanLoading] = useState(false);
  const [thanhToanModal, setThanhToanModal]     = useState(false);
  const [thanhToanStep, setThanhToanStep]       = useState(0);
  const [thanhToanPhieu, setThanhToanPhieu]     = useState(null);
  const [preview, setPreview]                   = useState(null);
  const [hinhThuc, setHinhThuc]                 = useState("Tiền mặt");
  const [ghiChu, setGhiChu]                     = useState("");
  const [soTienTra, setSoTienTra]               = useState("");
  const [previewLoading, setPreviewLoading]     = useState(false);
  const [thanhToanLoading, setThanhToanLoading] = useState(false);
  const [thanhToanResult, setThanhToanResult]   = useState(null);

  // ── Load data ──
  const load = useCallback(async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      const res = await getPhieuMuonByBanDoc(user.maBanDoc);
      setPhieuMuons(res.data?.data || []);
    } catch {
      message.error("Lỗi tải phiếu mượn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  // ── Hủy phiếu ──
  const handleHuy = (maPhieuMuon) => {
    Modal.confirm({
      title: "Xác nhận hủy phiếu mượn?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Bạn chắc chắn muốn hủy phiếu mượn này không?",
      okText: "Hủy phiếu", cancelText: "Không", okType: "danger",
      onOk: async () => {
        try {
          await huyPhieu(maPhieuMuon);
          message.success("Hủy phiếu thành công");
          load();
        } catch (err) {
          message.error(err.response?.data?.message || "Lỗi hủy phiếu");
        }
      },
    });
  };

  // ── Gia hạn ──
  const openGiaHan = (pm) => { setSelectedPhieu(pm); setSoNgayGiaHan(7); setGiaHanModal(true); };

  const handleGiaHan = async () => {
    if (!selectedPhieu || soNgayGiaHan < 1 || soNgayGiaHan > 30) {
      message.warning("Số ngày gia hạn từ 1 đến 30"); return;
    }
    setGiaHanLoading(true);
    try {
      await giaHan(selectedPhieu.maPhieuMuon, soNgayGiaHan);
      message.success(`Gia hạn thêm ${soNgayGiaHan} ngày thành công!`);
      setGiaHanModal(false); load();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi gia hạn");
    } finally {
      setGiaHanLoading(false);
    }
  };

  // ── Thanh toán ──
  const openThanhToan = async (pm) => {
    setThanhToanPhieu(pm); setThanhToanStep(0); setPreview(null);
    setHinhThuc("Tiền mặt"); setGhiChu(""); setSoTienTra(""); setThanhToanResult(null);
    setThanhToanModal(true); setPreviewLoading(true);
    try {
      const res = await previewThanhToan(pm.maPhieuMuon);
      setPreview(res.data); setThanhToanStep(1);
      setSoTienTra(String(res.data?.tongTien || ""));
    } catch {
      message.error("Không thể tải thông tin thanh toán"); setThanhToanModal(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleThanhToan = async () => {
    if (!thanhToanPhieu) return;
    const soTienNum = Number(soTienTra) || 0;
    if (soTienNum <= 0) { message.warning("Vui lòng nhập số tiền thanh toán"); return; }
    setThanhToanLoading(true);
    try {
      const res = await thanhToan({
        maPhieuMuon: thanhToanPhieu.maPhieuMuon,
        hinhThucThanhToan: hinhThuc,
        ghiChu: ghiChu,
        soTienTra: soTienNum,
      });
      setThanhToanResult(res.data); setThanhToanStep(2);
      message.success("Thanh toán thành công!"); load();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setThanhToanLoading(false);
    }
  };

  const handleXuatHoaDon = async (maThanhToan) => {
    try {
      const res = await xuatHoaDon(maThanhToan);
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url; link.download = `HoaDon_${maThanhToan}.pdf`;
      link.click(); window.URL.revokeObjectURL(url);
    } catch {
      message.error("Không thể xuất hóa đơn");
    }
  };

  // ── Tabs & filter ──
  const filterByTab = (list) => {
    if (activeTab === "active")  return list.filter((p) => ["Chờ duyệt", "Đang mượn"].includes(p.trangThai));
    if (activeTab === "overdue") return list.filter((p) => p.trangThai === "Quá hạn");
    if (activeTab === "done")    return list.filter((p) => ["Đã trả", "Đã hủy"].includes(p.trangThai));
    return list;
  };
  const displayed = filterByTab(phieuMuons);

  const tabItems = [
    { key: "all",     label: `Tất cả (${phieuMuons.length})` },
    { key: "active",  label: `Đang mượn (${phieuMuons.filter((p) => ["Chờ duyệt", "Đang mượn"].includes(p.trangThai)).length})` },
    { key: "overdue", label: `Quá hạn (${phieuMuons.filter((p) => p.trangThai === "Quá hạn").length})` },
    { key: "done",    label: `Đã xử lý (${phieuMuons.filter((p) => ["Đã trả", "Đã hủy"].includes(p.trangThai)).length})` },
  ];

  const STATS = [
    { label: "Đang mượn", color: "#1677ff", bg: "#e6f4ff" },
    { label: "Chờ duyệt", color: "#fa8c16", bg: "#fff7e6" },
    { label: "Quá hạn",   color: "#ff4d4f", bg: "#fff2f0" },
    { label: "Đã trả",    color: "#52c41a", bg: "#f6ffed" },
  ];

  return (
    <>
      <HeaderUser />
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Phiếu mượn của tôi</h2>
            <p style={styles.pageSubtitle}>Quản lý sách đang mượn, gia hạn và thanh toán trực tuyến</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={load} style={styles.btnRefresh}><ReloadOutlined /> Làm mới</button>
            <button onClick={() => navigate("/books")} style={styles.btnPrimary}>+ Mượn thêm sách</button>
          </div>
        </div>

        {/* Thống kê */}
        {!loading && phieuMuons.length > 0 && (
          <div style={styles.statsRow}>
            {STATS.map((s) => (
              <div key={s.label} style={{ ...styles.statCard, background: s.bg, border: `1px solid ${s.color}40` }}>
                <div style={{ ...styles.statNum, color: s.color }}>
                  {phieuMuons.filter((p) => p.trangThai === s.label).length}
                </div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: 16 }} />

        {/* Danh sách */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" tip="Đang tải..." /></div>
        ) : displayed.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📭</div>
            <h3 style={{ color: "#555" }}>Không có phiếu mượn nào</h3>
            <p style={{ color: "#888" }}>Hãy khám phá sách và bắt đầu mượn ngay!</p>
            <button onClick={() => navigate("/books")} style={{ ...styles.btnPrimary, marginTop: 12 }}>Khám phá sách</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {displayed.map((pm) => (
              <RentalCard
                key={pm.maPhieuMuon}
                pm={pm}
                onThanhToan={openThanhToan}
                onGiaHan={openGiaHan}
                onHuy={handleHuy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <GiaHanModal
        open={giaHanModal}
        selectedPhieu={selectedPhieu}
        soNgayGiaHan={soNgayGiaHan}
        setSoNgayGiaHan={setSoNgayGiaHan}
        loading={giaHanLoading}
        onOk={handleGiaHan}
        onCancel={() => setGiaHanModal(false)}
      />

      <ThanhToanModal
        open={thanhToanModal}
        onCancel={() => setThanhToanModal(false)}
        thanhToanStep={thanhToanStep}
        previewLoading={previewLoading}
        preview={preview}
        thanhToanPhieu={thanhToanPhieu}
        hinhThuc={hinhThuc}
        setHinhThuc={setHinhThuc}
        ghiChu={ghiChu}
        setGhiChu={setGhiChu}
        soTienTra={soTienTra}
        setSoTienTra={setSoTienTra}
        thanhToanLoading={thanhToanLoading}
        thanhToanResult={thanhToanResult}
        onConfirm={handleThanhToan}
        onXuatHoaDon={handleXuatHoaDon}
      />

      <FooterUser />
    </>
  );
};

export default RentalsPage;