import React, { useEffect, useState, useRef } from "react";
import { Table, Spin, Button, Modal, Form, Input, Tag, Popconfirm, message, Space } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import TaiKhoanForm from "../components/Form/TaiKhoanForm";
import { getTaiKhoans, createTaiKhoanThuThu, deleteTaiKhoan } from "../services/TaiKhoanService";

function TaiKhoanPage() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const hasFetched = useRef(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTaiKhoans();
            const list = res.data?.data || res.data || [];
            setData(list);
            setFiltered(list);
        } catch (err) {
            message.error("Lỗi tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchData();
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (!val.trim()) { setFiltered(data); return; }
        const kw = val.toLowerCase();
        setFiltered(data.filter(d =>
            d.tenTaiKhoan?.toLowerCase().includes(kw) ||
            d.vaiTro?.toLowerCase().includes(kw) ||
            d.hoTen?.toLowerCase().includes(kw)
        ));
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            await createTaiKhoanThuThu({
                TenTaiKhoan: values.tenTaiKhoan,
                MatKhau: values.matKhau,
                VaiTro: values.vaiTro || "Thủ thư",
            });
            message.success("Tạo tài khoản thành công");
            setOpen(false);
            form.resetFields();
            fetchData();
        } catch (err) {
            if (err?.errorFields) return;
            message.error(err.response?.data?.message || "Lỗi tạo tài khoản");
        }
    };

    const handleDelete = async (tenTaiKhoan) => {
        try {
            await deleteTaiKhoan(tenTaiKhoan);
            message.success("Xóa tài khoản thành công");
            fetchData();
        } catch (err) {
            message.error(err.response?.data?.message || "Lỗi xóa tài khoản");
        }
    };

    const roleColor = { Admin: "red", "Thủ thư": "blue", "Độc giả": "green" };

    const columns = [
        { title: "Tên tài khoản", dataIndex: "tenTaiKhoan", sorter: (a, b) => a.tenTaiKhoan.localeCompare(b.tenTaiKhoan) },
        { title: "Họ tên", dataIndex: "hoTen", render: v => v || "—" },
        {
            title: "Vai trò", dataIndex: "vaiTro",
            render: v => <Tag color={roleColor[v] || "default"}>{v}</Tag>,
            filters: [
                { text: "Admin", value: "Admin" },
                { text: "Thủ thư", value: "Thủ thư" },
                { text: "Độc giả", value: "Độc giả" },
            ],
            onFilter: (val, record) => record.vaiTro === val,
        },
        {
            title: "Hành động", width: 100,
            render: (_, record) => record.vaiTro !== "Admin" && (
                <Popconfirm
                    title="Xác nhận xóa tài khoản này?"
                    onConfirm={() => handleDelete(record.tenTaiKhoan)}
                    okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Quản lý tài khoản</h2>
                <Space>
                    <Input
                        placeholder="Tìm tài khoản..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={handleSearch}
                        style={{ width: 240 }}
                        allowClear
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>
                        Thêm tài khoản
                    </Button>
                </Space>
            </div>

            {loading ? <Spin size="large" /> : (
                <Table
                    dataSource={filtered}
                    rowKey="tenTaiKhoan"
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            )}

            <Modal open={open} onCancel={() => setOpen(false)} onOk={handleCreate}
                title="Thêm tài khoản" okText="Tạo" cancelText="Hủy">
                <TaiKhoanForm form={form} />
            </Modal>
        </div>
    );
}

export default TaiKhoanPage;