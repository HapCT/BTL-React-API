import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import { getTheLoais } from "../services/TheLoaiService";
import { getSachs } from "../services/SachService";

const API_BASE = "https://localhost:44352";

const DanhMucPage = () => {
  const navigate = useNavigate();
  const [theLoais, setTheLoais] = useState([]);
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [resTL, resSach] = await Promise.all([getTheLoais(), getSachs()]);
      const tlData = resTL.data?.data || resTL.data || [];
      const sachData = resSach.data?.data || [];
      setTheLoais(tlData);
      setBooks(sachData);
      if (tlData.length > 0) setSelected(tlData[0].maTheLoai);
    };
    load();
  }, []);

  const getImgSrc = (img) => {
    if (!img) return "https://via.placeholder.com/160x200?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE}${img}`;
  };

  const filteredBooks = books.filter((b) => {
    if (b.theLoaiList?.length > 0)
      return b.theLoaiList.some((tl) => tl.maTheLoai === selected);
    return b.maTheLoai === selected;
  });

  return (
    <>
      <HeaderUser />
      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "24px 16px", gap: 24 }}>
        {/* Sidebar danh mục */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <h3 style={{ marginBottom: 12 }}>📂 Danh mục</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {theLoais.map((tl) => (
              <div
                key={tl.maTheLoai}
                onClick={() => setSelected(tl.maTheLoai)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: selected === tl.maTheLoai ? 700 : 400,
                  background: selected === tl.maTheLoai ? "#1677ff" : "#f5f5f5",
                  color: selected === tl.maTheLoai ? "#fff" : "#333",
                  transition: "all 0.2s",
                }}
              >
                {tl.tenTheLoai}
              </div>
            ))}
          </div>
        </div>

        {/* Sách theo thể loại */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 16 }}>
            {theLoais.find((tl) => tl.maTheLoai === selected)?.tenTheLoai || ""}
            <span style={{ fontWeight: 400, color: "#888", fontSize: 14, marginLeft: 8 }}>
              ({filteredBooks.length} sách)
            </span>
          </h3>

          {filteredBooks.length === 0 ? (
            <p style={{ color: "#888" }}>Không có sách trong danh mục này.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {filteredBooks.map((book) => (
                <div
                  key={book.maSach}
                  onClick={() => navigate(`/sach/${book.maSach}`)}
                  style={{
                    cursor: "pointer",
                    borderRadius: 10,
                    border: "1px solid #f0f0f0",
                    padding: 10,
                    background: "#fff",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <img
                    src={getImgSrc(book.hinhAnh)}
                    alt={book.tieuDe}
                    style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                  />
                  <div style={{ fontWeight: 600, fontSize: 13, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {book.tieuDe}
                  </div>
                  <div style={{ color: "#888", fontSize: 12 }}>{book.tacGia}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterUser />
    </>
  );
};

export default DanhMucPage;