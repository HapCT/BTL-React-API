import React, { useState, useEffect } from "react";
import "../assets/css/HeaderUser.css";
import logo from "../assets/images/Logo.webp";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { searchSach } from "../services/SachService";
import { isLogin, getUser, logout } from "../utils/Auth";

const HeaderUser = () => {
    const [keyword, setKeyword] = useState("");
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLogin());

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = () => setShow(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!keyword.trim()) { setData([]); return; }
        const delay = setTimeout(() => {
            searchSach(keyword)
                .then((res) => { setData(res.data.data || []); setShow(true); })
                .catch(() => setData([]));
        }, 300);
        return () => clearTimeout(delay);
    }, [keyword]);

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/search?search=${encodeURIComponent(keyword)}`);
            setShow(false);
        }
    };

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        navigate("/");
    };

    const user = getUser();

    return (
        <div className="header">
            <div className="container">

                <div className="logo">
                    <a href="/"><img src={logo} alt="Logo" /></a>
                </div>

                <div className="nav">

                    <div
                        className="search-box"
                        style={{ position: "relative" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                            onFocus={() => setShow(true)}
                        />
                        <button onClick={handleSearch}>
                            <SearchOutlined />
                        </button>

                        {show && data.length > 0 && (
                            <div className="search-dropdown">
                                {data.map((item) => (
                                    <div
                                        key={item.maSach}
                                        className="search-item"
                                        onClick={() => { navigate(`/sach/${item.maSach}`); setShow(false); }}
                                    >
                                        <img src={item.hinhAnh} alt={item.tieuDe} />
                                        <div>
                                            <div>{item.tieuDe}</div>
                                            <small>{item.tacGia}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ul>
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/books">Sách</a></li>
                        <li><a href="/danhmuc">Danh mục</a></li>

                        {loggedIn ? (
                            <>
                                <li><a href="/rentals">Phiếu mượn</a></li>
                                <li><a href="/cart">Đặt chỗ</a></li>
                                <li>
                                    <a href="/profile">
                                        {user?.hoTen || "Hồ sơ"}
                                    </a>
                                </li>
                                <li>
                                    <button className="nav-logout" onClick={handleLogout}>
                                        Đăng xuất
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <a href="/login" className="nav-login">Đăng nhập</a>
                            </li>
                        )}
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default HeaderUser;