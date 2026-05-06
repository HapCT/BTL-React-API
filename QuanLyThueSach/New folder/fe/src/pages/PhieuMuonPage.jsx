import React, { useEffect, useState } from "react";
import { message, Modal, Button, Form, Input, Tag } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import PhieuMuonTable from "../components/Tables/PhieuMuonTable";
import PhieuMuonOffForm from "../components/Form/PhieuMuonForm";
import { thanhToan, previewThanhToan } from "../services/ThanhToanService";
import {
  getPhieuMuons,
  duyetMuon,
  traSach,
  giaHan,
  huyPhieu,
  dangKyMuonOff,
} from "../services/PhieuMuonService";

import { getBanDocs } from "../services/BanDocService";
import { getBanSaos } from "../services/BanSaoService";

function PhieuMuonPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [hoaDon, setHoaDon] = useState(null);
  const [open, setOpen] = useState(false);
  const [openOff, setOpenOff] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [banDocList, setBanDocList] = useState([]);
  const [banSaoList, setBanSaoList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getPhieuMuons();
      const list = res.data?.data || res.data || [];
      setData(list);
      setFiltered(list);
    } catch {
      message.error("Lỗi tải phiếu mượn");
    }
  };

  const fetchExtra = async () => {
    try {
      const [bd, bs] = await Promise.all([getBanDocs(), getBanSaos()]);
      setBanDocList(bd.data?.data || bd.data || []);
      setBanSaoList(bs.data?.data || bs.data || []);
    } catch {
      message.warning("Không tải được danh sách bạn đọc / bản sao");
    }
  };

  useEffect(() => {
    fetchData();
    fetchExtra();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) {
      setFiltered(data);
    } else {
      const kw = val.toLowerCase();
      setFiltered(
        data.filter(
          (d) =>
            d.maPhieuMuon?.toLowerCase().includes(kw) ||
            d.tenBanDoc?.toLowerCase().includes(kw) ||
            d.tenSach?.toLowerCase().includes(kw) ||
            d.trangThai?.toLowerCase().includes(kw)
        )
      );
    }
  };

  const handleDuyet = async (id) => {
    try {
      await duyetMuon(id);
      message.success("Đã duyệt phiếu mượn");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi duyệt");
    }
  };

  const handleTra = async (id) => {
    try {
      setSelectedId(id);
      const res = await previewThanhToan(id);
      setHoaDon(res.data);
      setOpen(true);
    } catch {
      message.error("Lỗi tính tiền");
    }
  };

  const handleGiaHan = async (id) => {
    try {
      await giaHan(id, 3);
      message.success("Đã gia hạn 3 ngày");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi gia hạn");
    }
  };

  const handleThanhToan = async () => {
    try {
      setConfirmLoading(true);
      await thanhToan({
        MaPhieuMuon: selectedId,
        HinhThucThanhToan: "Tiền mặt",
        GhiChu: "",
      });
      message.success("Trả sách và thanh toán thành công");
      setOpen(false);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi trả sách");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleHuy = async (id) => {
    try {
      await huyPhieu(id);
      message.success("Đã huỷ phiếu");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi huỷ");
    }
  };

  const handleOpenOff = () => {
    form.resetFields();
    setOpenOff(true);
  };

  const handleDangKyOff = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        maBanDoc: values.maBanDoc,
        maBanSao: values.maBanSao,
        ngayTao: (values.ngayTao ?? values.ngayMuon).format("YYYY-MM-DD"),
        ngayMuon: values.ngayMuon.format("YYYY-MM-DD"),
        hanTra: values.hanTra.format("YYYY-MM-DD"),
      };

      await dangKyMuonOff(payload);
      message.success("Mượn tại quầy thành công");
      setOpenOff(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || "Lỗi đăng ký mượn tại quầy");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý phiếu mượn</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm kiếm phiếu mượn..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            style={{ width: 260 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenOff}
          >
            Mượn tại quầy
          </Button>
        </div>
      </div>

      <PhieuMuonTable
        data={filtered}
        onDuyet={handleDuyet}
        onTra={handleTra}
        onGiaHan={handleGiaHan}
        onHuy={handleHuy}
      />

      {/* MODAL THANH TOÁN */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Hóa đơn thanh toán"
      >
        <div style={{ padding: "8px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>Tiền thuê:</span>
            <b>
              {(
                hoaDon?.tienThue ||
                hoaDon?.TienThue ||
                0
              ).toLocaleString("vi-VN")}{" "}
              đ
            </b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>Tiền phạt:</span>
            <b style={{ color: "#ff4d4f" }}>
              {(
                hoaDon?.tienPhat ||
                hoaDon?.TienPhat ||
                0
              ).toLocaleString("vi-VN")}{" "}
              đ
            </b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              fontSize: 16,
            }}
          >
            <span>
              <b>Tổng tiền:</b>
            </span>
            <b style={{ color: "#1677ff", fontSize: 18 }}>
              {(
                hoaDon?.tongTien ||
                hoaDon?.TongTien ||
                0
              ).toLocaleString("vi-VN")}{" "}
              đ
            </b>
          </div>
        </div>
        <Button
          type="primary"
          block
          loading={confirmLoading}
          onClick={handleThanhToan}
          style={{ marginTop: 8 }}
        >
          Xác nhận thanh toán
        </Button>
      </Modal>

      <Modal
        open={openOff}
        onCancel={() => setOpenOff(false)}
        onOk={handleDangKyOff}
        title="Mượn sách tại quầy"
        okText="Xác nhận mượn"
        cancelText="Hủy"
        destroyOnClose
        width={520}
      >
        <PhieuMuonOffForm
          form={form}
          banDocList={banDocList}
          banSaoList={banSaoList}
        />
      </Modal>
    </div>
  );
}

export default PhieuMuonPage;