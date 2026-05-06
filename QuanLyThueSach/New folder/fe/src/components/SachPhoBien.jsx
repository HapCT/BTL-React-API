import React, { useRef } from "react";
import "./home/HotBooks.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://localhost:44352";
const LIMIT = 6;

const SachPhoBien = ({ data }) => {
    const navigate = useNavigate();
    const rowRef = useRef(null);

    const scroll = (dir) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
        }
    };

    const getImgSrc = (img) => {
        if (!img) return "https://via.placeholder.com/160x220?text=No+Image";
        return img.startsWith("http") ? img : `${API_BASE}${img}`;
    };

    const displayed = (data || []).slice(0, LIMIT);

    return (
        <section className="hot-books">
            <div className="hot-books__header">
                <h2 className="hot-books__title">Sách Phổ Biến</h2>
                <div className="hot-books__nav">
                    <button className="hb-nav-btn" onClick={() => scroll(-1)} aria-label="Trước">‹</button>
                    <button className="hb-nav-btn" onClick={() => scroll(1)} aria-label="Tiếp">›</button>
                </div>
            </div>

            <div className="hot-books__row" ref={rowRef}>
                {displayed.length > 0 ? (
                    <>
                        {displayed.map((book) => (
                            <div
                                className="hb-card"
                                key={book.maSach}
                                onClick={() => navigate(`/sach/${book.maSach}`)}
                            >
                                <div className="hb-card__img">
                                    <img
                                        src={getImgSrc(book.hinhAnh)}
                                        alt={book.tieuDe}
                                        onError={e => { e.target.src = "https://via.placeholder.com/160x220?text=No+Image"; }}
                                    />
                                    <span className="hb-tag">HOT</span>
                                </div>
                                <h4 className="hb-card__title">{book.tieuDe}</h4>
                                <p className="hb-card__author">{book.tacGia}</p>
                            </div>
                        ))}

                        <div className="hb-card hb-card--viewall" onClick={() => navigate("/books")}>
                            <div className="hb-card__img hb-viewall__box">
                                <span className="hb-viewall__arrow">→</span>
                                <p className="hb-viewall__text">Xem tất cả sách</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <p style={{ color: '#aaa' }}>Không có sách</p>
                )}
            </div>
        </section>
    );
};

export default SachPhoBien;