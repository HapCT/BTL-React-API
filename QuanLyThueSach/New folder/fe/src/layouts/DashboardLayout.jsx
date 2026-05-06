import React, { useState } from "react";
import { Layout, theme } from "antd";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />

      <Layout>
        <HeaderBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          bg={colorBgContainer}
        />

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;