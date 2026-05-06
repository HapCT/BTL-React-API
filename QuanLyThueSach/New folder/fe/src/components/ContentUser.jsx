import React from 'react';
import "../assets/css/ContentUser.css";
import "../assets/css/All.css";

import ContentHeader from './Content-header';
import ContentMid from './ContentMid';
import QuyTrinh from './QuyTrinh';
import SachMoi from "./SachMoi";
import { getSachs, getSachPhoBien } from "../services/SachService";
import SachPhoBien from "./SachPhoBien";
const ContentUser = () => {
    const [sachs, setSachs] = React.useState([]);
    const [sachPhoBien, setSachPhoBien] = React.useState([]);
    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // lấy sách
            const resSach = await getSachs();
            setSachs(resSach.data.data || []);

            // 🔥 lấy sách phổ biến
            const resPhoBien = await getSachPhoBien();
            setSachPhoBien(resPhoBien.data.data || []);

        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 lấy sách mới
    const sachMoi = [...sachs].slice(-8).reverse();
    return (
        <div className="content">
            <ContentHeader />
            <ContentMid />
            <QuyTrinh />
            <SachMoi data={sachMoi} />

            {/* 🔥 sách phổ biến thật */}
            <SachPhoBien data={sachPhoBien} />
        </div>
    );
}

export default ContentUser;