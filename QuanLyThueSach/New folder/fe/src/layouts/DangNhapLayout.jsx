import React from "react";
import { Layout } from "antd";
import { Outlet, Navigate } from "react-router-dom";
import { isLogin, isAdmin, isThuThu } from "../utils/Auth";

const { Content } = Layout;

const DangNhapLayout = () => {
  if (isLogin()) {
    if (isAdmin()) return <Navigate to="/admin" />;
    if (isThuThu()) return <Navigate to="/thuthu" />;
    return <Navigate to="/index" />;
  }

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

export default DangNhapLayout;