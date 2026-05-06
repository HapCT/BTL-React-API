import React, { useEffect, useState } from "react";
import "../assets/css/ContentMid.css";
import "../assets/css/All.css";
import {getSachs} from "../services/SachService"
import { message } from "antd";
const ContentMid = () => {
    const [books, setBooks] = useState([]);
    useEffect(()=> 
    {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const res = await getSachs();
            console.log("Data API: ", res.data);
            setBooks(res.data.data);
        }catch(error){
            message.error("Lỗi lấy sách: ", error)
        }
    }
        const API_BASE = "https://localhost:44352";
    return (
        <div className="content-mid">
            <div className="book_hot">
                <h2>Sách được thuê nhiều nhất</h2>

                <div className="book_hot_list">
                    {books && books.length > 0 ? (
                        books.map((book) => (
                            <div className="book_hot_item" key={book.maSach}>
                                <div className="Anh">
                                    <img
                                        src={book.hinhAnh?.startsWith("http") ? book.hinhAnh : `${API_BASE}${book.hinhAnh}`}
                                        alt={book.tieuDe}
                                    />
                                    <span className="tag">HOT</span>
                                </div>
                                <h4 className="tieuDe">{book.tieuDe}</h4>
                                <p className="tacGia">{book.tacGia}</p>
                            </div>
                        ))
                    ): (
                        <p>Không có sách</p>
                    )}
                </div>

            </div>
        </div>

    )
};
export default ContentMid;