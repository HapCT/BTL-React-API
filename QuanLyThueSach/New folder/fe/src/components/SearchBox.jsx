import React, { useState, useEffect } from "react";
import { searchSach } from "../services/sachService";

const SearchBox = () => {
    const [keyword, setKeyword] = useState("");
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);


    useEffect(() => {
        const handleClick = () => setShow(false);
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);


    useEffect(() => {
        if (!keyword.trim()) {
            setData([]);
            return;
        }

        const delay = setTimeout(() => {
            searchSach(keyword)
                .then((res) => {
                    setData(res.data.data || []);
                    setShow(true);
                })
                .catch(() => {
                    setData([]);
                });
        }, 300);

        return () => clearTimeout(delay);
    }, [keyword]);

    return (
        <div
            style={{ position: "relative", width: "350px" }}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm sách, tác giả..."
                style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                }}
                onFocus={() => setShow(true)}
            />

            {show && data.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "42px",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                >
                    {data.map((item) => (
                        <div
                            key={item.maSach}
                            style={{
                                display: "flex",
                                gap: "10px",
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <img
                                src={item.hinhAnh}
                                alt={item.tieuDe}
                                style={{
                                    width: 40,
                                    height: 55,
                                    objectFit: "cover",
                                }}
                            />

                            <div>
                                <div style={{ fontWeight: "bold" }}>
                                    {item.tieuDe}
                                </div>
                                <div style={{ fontSize: 12, color: "gray" }}>
                                    {item.tacGia}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBox;