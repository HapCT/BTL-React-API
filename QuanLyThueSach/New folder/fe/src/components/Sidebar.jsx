import React from "react";
import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    CopyOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    TagsOutlined,
    ScheduleOutlined,
    WarningOutlined,
    DollarOutlined,
    FileProtectOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { key: "/admin",      icon: <DashboardOutlined />,    label: "Tổng quan" },
        { key: "/bandoc",     icon: <UserOutlined />,          label: "Quản lý bạn đọc" },
        { key: "/sach",       icon: <BookOutlined />,          label: "Quản lý sách" },
        { key: "/bansao",     icon: <CopyOutlined />,          label: "Quản lý bản sao" },
        { key: "/kesach",     icon: <DatabaseOutlined />,      label: "Quản lý kệ sách" },
        { key: "/theloai",    icon: <TagsOutlined />,          label: "Quản lý thể loại" },
        { key: "/phieumuon",  icon: <ScheduleOutlined />,      label: "Quản lý phiếu mượn" },
        { key: "/datcho",     icon: <FileProtectOutlined />,   label: "Quản lý đặt chỗ" },
        { key: "/phat",       icon: <WarningOutlined />,       label: "Quản lý phạt" },
        { key: "/thanhtoan",  icon: <DollarOutlined />,        label: "Quản lý thanh toán" },
        { key: "/taikhoan",   icon: <UserOutlined />,          label: "Quản lý tài khoản" },
        { key: "/hoadonnhap", icon: <ShoppingCartOutlined />,  label: "Hóa đơn nhập" },
    ];

    return (
        <Sider collapsible collapsed={collapsed} trigger={null} width={220}>
            <div style={{
                height: 56, display: "flex", alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? 0 : "0 20px",
                color: "#fff", fontWeight: 700, fontSize: collapsed ? 18 : 16,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                letterSpacing: 1
            }}>
                {collapsed ? "📚" : "📚 Thư Viện"}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={(e) => navigate(e.key)}
            />
        </Sider>
    );
};

export default Sidebar;