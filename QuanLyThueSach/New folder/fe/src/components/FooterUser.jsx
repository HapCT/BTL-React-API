import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/FooterUser.css";

const FooterUser = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer-wrapper">
            <div className="footer-main">
                {/* Brand */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="footer-logo-icon">📚</span>
                        <span className="footer-logo-text">Nhà sách Huy Anh</span>
                    </div>
                    <p className="footer-tagline">
                        Nơi tri thức gặp gỡ đam mê đọc sách.<br />
                        Hàng nghìn đầu sách chờ bạn khám phá.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-btn" title="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="#" className="social-btn" title="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                        </a>
                        <a href="#" className="social-btn" title="YouTube">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.34z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>
                        </a>
                    </div>
                </div>

                {/* Khám phá */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Khám phá</h4>
                    <ul className="footer-links">
                        <li><button onClick={() => navigate("/books")}>Tất cả sách</button></li>
                        <li><button onClick={() => navigate("/danhmuc")}>Danh mục</button></li>
                        <li><button onClick={() => navigate("/search?search=")}>Tìm kiếm</button></li>
                        <li><button onClick={() => navigate("/rentals")}>Phiếu mượn</button></li>
                    </ul>
                </div>

                {/* Thông tin */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Thông tin liên hệ</h4>
                    <ul className="footer-contact">
                        <li>
                            <span className="contact-icon">📍</span>
                            <span>123 Đường X, Hưng Yên</span>
                        </li>
                        <li>
                            <span className="contact-icon">📞</span>
                            <span>0123 456 789</span>
                        </li>
                        <li>
                            <span className="contact-icon">✉️</span>
                            <span>phamhuyanh22@gmail.com</span>
                        </li>
                    </ul>
                </div>

                {/* Giờ mở cửa */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Giờ mở cửa</h4>
                    <ul className="footer-hours">
                        <li>
                            <span>Thứ 2 – Thứ 6</span>
                            <span className="hours-val">8:00 – 18:00</span>
                        </li>
                        <li>
                            <span>Thứ 7</span>
                            <span className="hours-val">9:00 – 17:00</span>
                        </li>
                        <li>
                            <span>Chủ nhật</span>
                            <span className="hours-val closed">Đóng cửa</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Nhà sách Huy Anh. Bảo lưu mọi quyền.</span>
                <span className="footer-bottom-links">
                    <a href="#">Chính sách</a> · <a href="#">Điều khoản</a>
                </span>
            </div>
        </footer>
    );
};

export default FooterUser;