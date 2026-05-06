import React, { useEffect, useRef, useState } from "react";
import { getSachs } from "../../services/SachService";
import { message } from "antd";
import "./HotBooks.css";

const API_BASE = "https://localhost:44352";

/**
 * HotBooks — "Sách được thuê nhiều nhất"
 * Scroll ngang bằng 2 nút điều hướng trái / phải.
 */
const HotBooks = () => {
    const [books, setBooks] = useState([]);
    const rowRef = useRef(null);

    useEffect(() => {
        getSachs()
            .then((res) => setBooks(res.data.data || []))
            .catch(() => message.error("Lỗi lấy sách hot"));
    }, []);

    const scroll = (dir) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
        }
    };

    const getImg = (img) =>
        img
            ? img.startsWith("http")
                ? img
                : `${API_BASE}${img}`
            : "https://via.placeholder.com/160x220?text=No+Image";

    return (
        <section className="hot-books">
            <div className="hot-books__header">
                <h2 className="hot-books__title">Sách được thuê nhiều nhất</h2>
                <div className="hot-books__nav">
                    <button className="hb-nav-btn" onClick={() => scroll(-1)} aria-label="Trước">‹</button>
                    <button className="hb-nav-btn" onClick={() => scroll(1)}  aria-label="Tiếp">›</button>
                </div>
            </div>

            <div className="hot-books__row" ref={rowRef}>
                {books.length > 0 ? (
                    books.map((book) => (
                        <div className="hb-card" key={book.maSach}>
                            <div className="hb-card__img">
                                <img src={getImg(book.hinhAnh)} alt={book.tieuDe} />
                                <span className="hb-tag">HOT</span>
                            </div>
                            <h4 className="hb-card__title">{book.tieuDe}</h4>
                            <p className="hb-card__author">{book.tacGia}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có sách</p>
                )}
            </div>
        </section>
    );
};

export default HotBooks;
