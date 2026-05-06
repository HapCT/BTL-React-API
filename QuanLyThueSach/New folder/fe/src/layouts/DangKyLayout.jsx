import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const DangKyLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default DangKyLayout;