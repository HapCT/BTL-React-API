import React from "react";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import HomePage   from "../components/home/HomePage";
import "../assets/css/All.css";

/**
 * UserLayout — layout trang dành cho người dùng (không đăng nhập / đã đăng nhập).
 *
 * Cấu trúc:
 *   HeaderUser
 *   └─ HomePage (trang chủ, chứa các section)
 *   FooterUser
 */
const UserLayout = () => {
    return (
        <div className="layout">
            <HeaderUser />
            <div className="content-user" style={{ minHeight: "80vh" }}>
                <HomePage />
            </div>
            <FooterUser />
        </div>
    );
};

export default UserLayout;
