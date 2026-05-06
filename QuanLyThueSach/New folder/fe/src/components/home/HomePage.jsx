import React, { useEffect, useState } from "react";
import { getSachs, getSachPhoBien } from "../../services/SachService";

// Các section của trang chủ
import BannerSlider from "./BannerSlider";
import HotBooks    from "./HotBooks";
import QuyTrinh    from "../QuyTrinh";
import SachMoi     from "../SachMoi";
import SachPhoBien from "../SachPhoBien";

/**
 * HomePage — trang chủ được tổ chức theo từng section riêng biệt.
 *
 * Cấu trúc:
 *  1. BannerSlider  — banner chính có nút trượt trái/phải
 *  2. HotBooks      — sách hot (scroll ngang, nút nav)
 *  3. QuyTrinh      — 3 bước đơn giản
 *  4. SachMoi       — sách mới lên kệ (grid)
 *  5. SachPhoBien   — sách phổ biến (grid)
 */
const HomePage = () => {
    const [sachs, setSachs]           = useState([]);
    const [sachPhoBien, setSachPhoBien] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [resSach, resPhoBien] = await Promise.all([
                    getSachs(),
                    getSachPhoBien(),
                ]);
                setSachs(resSach.data.data || []);
                setSachPhoBien(resPhoBien.data.data || []);
            } catch (err) {
                console.error("Lỗi tải dữ liệu trang chủ:", err);
            }
        };
        load();
    }, []);

    // 8 sách mới nhất (lấy từ cuối mảng)
    const sachMoi = [...sachs].slice(-8).reverse();

    return (
        <div className="home-page">
            {/* 1. Banner slideshow */}
            <BannerSlider />

            {/* 2. Sách hot — scroll ngang */}
            <HotBooks />

            {/* 3. Quy trình 3 bước */}
            <QuyTrinh />

            {/* 4. Sách mới */}
            <SachMoi data={sachMoi} />

            {/* 5. Sách phổ biến */}
            <SachPhoBien data={sachPhoBien} />
        </div>
    );
};

export default HomePage;
