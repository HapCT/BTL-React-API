import React from "react";
import { Layout, Menu } from "antd";
import {
    UserOutlined,
    ScheduleOutlined,
    WarningOutlined,
    DollarOutlined,
    FileProtectOutlined,
    BookOutlined,
    CopyOutlined,
    DashboardOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const SidebarThuThu = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { key: "/thuthu",          icon: <DashboardOutlined />,    label: "Tổng quan" },
        { key: "/thuthu/bandoc",   icon: <UserOutlined />,         label: "Quản lý bạn đọc" },
        { key: "/thuthu/sach",     icon: <BookOutlined />,         label: "Quản lý sách" },
        { key: "/thuthu/bansao",   icon: <CopyOutlined />,         label: "Quản lý bản sao" },
        { key: "/thuthu/phieumuon",icon: <ScheduleOutlined />,     label: "Quản lý phiếu mượn" },
        { key: "/thuthu/datcho",   icon: <FileProtectOutlined />,  label: "Quản lý đặt chỗ" },
        { key: "/thuthu/phat",     icon: <WarningOutlined />,      label: "Quản lý phạt" },
        { key: "/thuthu/thanhtoan",icon: <DollarOutlined />,       label: "Quản lý thanh toán" },
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
                {collapsed ? "📚" : "📚 Thủ Thư"}
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

export default SidebarThuThu;
