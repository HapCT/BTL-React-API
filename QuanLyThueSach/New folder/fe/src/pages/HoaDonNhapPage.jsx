import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  message,
  Input,
  Descriptions,
  Table,
  Tag,
  Space,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import HoaDonNhapForm from "../components/Form/HoaDonNhapForm";
import HoaDonNhapTable from "../components/Tables/HoaDonNhapTable";
import {
  getHoaDonNhaps,
  getHoaDonNhapById,
  createHoaDonNhap,
  updateHoaDonNhap,
  deleteHoaDonNhap,
} from "../services/HoaDonNhapService";
import { getSachs } from "../services/SachService";

function HoaDonNhapPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sachList, setSachList] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res = await getHoaDonNhaps();
      const list = res.data?.data || res.data || [];
      setData(list);
      setFiltered(list);
    } catch {
      message.error("Lỗi tải danh sách hóa đơn nhập");
    }
  };

  useEffect(() => {
    fetchData();
    getSachs()
      .then((res) => setSachList(res.data?.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) {
      setFiltered(data);
      return;
    }
    const kw = val.toLowerCase();
    setFiltered(
      data.filter(
        (d) =>
          d.maHoaDonNhap?.toLowerCase().includes(kw) ||
          d.nhaCungCap?.toLowerCase().includes(kw) ||
          d.nguoiNhap?.toLowerCase().includes(kw)
      )
    );
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ ngayNhap: dayjs(), chiTiet: [] });
    setOpen(true);
  };

  const handleEdit = async (record) => {
    try {
  
      let detail = record;
      if (!record.chiTiet) {
        const res = await getHoaDonNhapById(record.maHoaDonNhap);
        detail = res.data?.data || res.data || record;
      }
      setEditing(detail);
      form.setFieldsValue({
        nhaCungCap: detail.nhaCungCap,
        ngayNhap: detail.ngayNhap ? dayjs(detail.ngayNhap) : dayjs(),
        nguoiNhap: detail.nguoiNhap,
        ghiChu: detail.ghiChu,
        chiTiet: detail.chiTiet || [],
      });
      setOpen(true);
    } catch {
      message.error("Không tải được chi tiết hóa đơn");
    }
  };

  const handleView = async (record) => {
    try {
      let detail = record;
      if (!record.chiTiet) {
        const res = await getHoaDonNhapById(record.maHoaDonNhap);
        detail = res.data?.data || res.data || record;
      }
      setViewing(detail);
      setViewOpen(true);
    } catch {
      setViewing(record);
      setViewOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHoaDonNhap(id);
      message.success("Xóa hóa đơn nhập thành công");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi xóa hóa đơn");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const chiTiet = values.chiTiet || [];
      if (chiTiet.length === 0) {
        message.error("Thêm ít nhất 1 sách vào hóa đơn");
        return;
      }
      const hasEmpty = chiTiet.some((r) => !r.maSach);
      if (hasEmpty) {
        message.error("Vui lòng chọn sách cho tất cả các dòng");
        return;
      }

      const tongTien = chiTiet.reduce(
        (sum, r) => sum + (r.soLuong || 0) * (r.donGia || 0),
        0
      );

      const payload = {
        nhaCungCap: values.nhaCungCap,
        ngayNhap: values.ngayNhap
          ? values.ngayNhap.format("YYYY-MM-DD")
          : null,
        nguoiNhap: values.nguoiNhap || "",
        ghiChu: values.ghiChu || "",
        tongTien,
        chiTiet: chiTiet.map((r) => ({
          maSach: r.maSach,
          soLuong: r.soLuong || 1,
          donGia: r.donGia || 0,
          thanhTien: (r.soLuong || 1) * (r.donGia || 0),
        })),
      };

      if (editing) {
        await updateHoaDonNhap(editing.maHoaDonNhap, payload);
        message.success("Cập nhật hóa đơn nhập thành công");
      } else {
        await createHoaDonNhap(payload);
        message.success("Tạo hóa đơn nhập thành công");
      }

      setOpen(false);
      fetchData();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || "Lỗi xử lý hóa đơn");
    } finally {
      setLoading(false);
    }
  };


  const tongGiaTri = data.reduce((s, d) => s + Number(d.tongTien || 0), 0);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Quản lý hóa đơn nhập</h2>
          <span style={{ color: "#888", fontSize: 13 }}>
            {data.length} hóa đơn · Tổng giá trị:{" "}
            <b style={{ color: "#1677ff" }}>
              {tongGiaTri.toLocaleString("vi-VN")}₫
            </b>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm theo mã, nhà cung cấp..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            style={{ width: 260 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Tạo hóa đơn nhập
          </Button>
        </div>
      </div>

      <HoaDonNhapTable
        data={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Modal
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        title={
          <Space>
            <FileTextOutlined />
            {editing ? "Cập nhật hóa đơn nhập" : "Tạo hóa đơn nhập mới"}
          </Space>
        }
        okText={editing ? "Cập nhật" : "Tạo hóa đơn"}
        cancelText="Hủy"
        confirmLoading={loading}
        width={780}
        destroyOnClose
      >
        <HoaDonNhapForm form={form} sachList={sachList} editing={editing} />
      </Modal>

      {/* Modal Xem chi tiết */}
      <Modal
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewOpen(false)}>
            Đóng
          </Button>,
        ]}
        title={
          <Space>
            <FileTextOutlined />
            Chi tiết hóa đơn nhập
          </Space>
        }
        width={700}
      >
        {viewing && <HoaDonNhapDetail record={viewing} sachList={sachList} />}
      </Modal>
    </div>
  );
}

// Component xem chi tiết
function HoaDonNhapDetail({ record, sachList }) {
  const sachMap = Object.fromEntries(
    sachList.map((s) => [s.maSach, s.tieuDe])
  );

  const chiTietColumns = [
    {
      title: "Sách",
      dataIndex: "maSach",
      render: (v) => sachMap[v] || v,
    },
    { title: "Số lượng", dataIndex: "soLuong", width: 90, align: "center" },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      width: 130,
      align: "right",
      render: (v) => Number(v || 0).toLocaleString("vi-VN") + "₫",
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      width: 130,
      align: "right",
      render: (v, row) =>
        (
          Number(v || 0) || (row.soLuong || 0) * (row.donGia || 0)
        ).toLocaleString("vi-VN") + "₫",
    },
  ];

  return (
    <div>
      <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Mã hóa đơn">
          {record.maHoaDonNhap}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày nhập">
          {record.ngayNhap
            ? dayjs(record.ngayNhap).format("DD/MM/YYYY")
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Nhà cung cấp">
          {record.nhaCungCap}
        </Descriptions.Item>
        <Descriptions.Item label="Người nhập">
          {record.nguoiNhap || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" span={2}>
          <b style={{ color: "#1677ff", fontSize: 15 }}>
            {Number(record.tongTien || 0).toLocaleString("vi-VN")}₫
          </b>
        </Descriptions.Item>
        {record.ghiChu && (
          <Descriptions.Item label="Ghi chú" span={2}>
            {record.ghiChu}
          </Descriptions.Item>
        )}
      </Descriptions>

      {record.chiTiet?.length > 0 && (
        <>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Chi tiết sách:</div>
          <Table
            dataSource={record.chiTiet}
            columns={chiTietColumns}
            rowKey={(r, i) => r.maSach + i}
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} align="right">
                  <b>Tổng cộng</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <b style={{ color: "#1677ff" }}>
                    {record.chiTiet
                      .reduce(
                        (s, r) =>
                          s +
                          (Number(r.thanhTien) ||
                            (r.soLuong || 0) * (r.donGia || 0)),
                        0
                      )
                      .toLocaleString("vi-VN")}
                    ₫
                  </b>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </>
      )}
    </div>
  );
}

export default HoaDonNhapPage;