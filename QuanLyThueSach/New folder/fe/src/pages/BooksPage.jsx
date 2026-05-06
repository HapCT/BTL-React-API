import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import FooterUser from "../components/FooterUser";
import { getSachs } from "../services/SachService";
import { getTheLoais } from "../services/TheLoaiService";

const API_BASE = "  https://localhost:44352";

const BooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [theLoais, setTheLoais] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTheLoai, setSelectedTheLoai] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [resSach, resTL] = await Promise.all([getSachs(), getTheLoais()]);
        const sachData = resSach.data?.data || [];
        const tlData = resTL.data?.data || resTL.data || [];
        setBooks(sachData);
        setFiltered(sachData);
        setTheLoais(tlData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...books];

    if (selectedTheLoai !== "all") {
      result = result.filter((b) => {
        if (b.theLoaiList?.length > 0)
          return b.theLoaiList.some((tl) => String(tl.maTheLoai) === selectedTheLoai);
        return String(b.maTheLoai) === selectedTheLoai;
      });
    }

    if (sort === "az") result.sort((a, b) => a.tieuDe.localeCompare(b.tieuDe));
    if (sort === "za") result.sort((a, b) => b.tieuDe.localeCompare(a.tieuDe));
    if (sort === "new") result = [...result].reverse();

    setFiltered(result);
  }, [selectedTheLoai, sort, books]);

  const getImgSrc = (img) => {
    if (!img) return "https://via.placeholder.com/160x200?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE}${img}`;
  };

  return (
    <>
      <HeaderUser />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        <h2 style={{ marginBottom: 20 }}>Tất cả sách</h2>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
          <div>
            <label style={{ marginRight: 8, fontWeight: 500 }}>Thể loại:</label>
            <select
              value={selectedTheLoai}
              onChange={(e) => setSelectedTheLoai(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d9d9d9" }}
            >
              <option value="all">Tất cả</option>
              {theLoais.map((tl) => (
                <option key={tl.maTheLoai} value={String(tl.maTheLoai)}>
                  {tl.tenTheLoai}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ marginRight: 8, fontWeight: 500 }}>Sắp xếp:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d9d9d9" }}
            >
              <option value="default">Mặc định</option>
              <option value="new">Mới nhất</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </div>
          <span style={{ color: "#888", marginLeft: "auto" }}>
            {filtered.length} sách
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <p>Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#888" }}>Không có sách nào.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 20 }}>
            {filtered.map((book) => (
              <div
                key={book.maSach}
                onClick={() => navigate(`/sach/${book.maSach}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: 10,
                  border: "1px solid #f0f0f0",
                  padding: 12,
                  transition: "box-shadow 0.2s",
                  background: "#fff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <img
                  src={getImgSrc(book.hinhAnh)}
                  alt={book.tieuDe}
                  style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                />
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {book.tieuDe}
                </div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 6 }}>{book.tacGia}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {book.theLoaiList?.length > 0
                    ? book.theLoaiList.map((tl) => (
                        <span key={tl.maTheLoai} style={{ background: "#e6f4ff", color: "#1677ff", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>
                          {tl.tenTheLoai}
                        </span>
                      ))
                    : book.tenTheLoai && (
                        <span style={{ background: "#e6f4ff", color: "#1677ff", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>
                          {book.tenTheLoai}
                        </span>
                      )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FooterUser />
    </>
  );
};

export default BooksPage;