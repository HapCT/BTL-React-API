import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchSach, getSachs } from "../services/SachService";
import { getTheLoais } from "../services/TheLoaiService";
import "../assets/css/SearchPage.css";
import HeaderUser from "../components/HeaderUser";

const API_BASE = "https://localhost:44352";

const TimKiemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const keyword = params.get("search") || "";

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theLoais, setTheLoais] = useState([]);


  const [sort, setSort] = useState("relevance");
  const [selectedTheLoai, setSelectedTheLoai] = useState("all");
  const [selectedNgonNgu, setSelectedNgonNgu] = useState("all");
  const [selectedNam, setSelectedNam] = useState("all");

  useEffect(() => {
    getTheLoais().then(res => setTheLoais(res.data?.data || res.data || []));
  }, []);

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    searchSach(keyword)
      .then(res => setData(res.data?.data || []))
      .finally(() => setLoading(false));
  }, [keyword]);

  // Derive unique values for filters
  const ngonNguList = [...new Set(data.map(d => d.ngonNgu).filter(Boolean))];
  const namDecades = [...new Set(data.map(d => {
    if (!d.namXB) return null;
    const y = parseInt(d.namXB);
    return isNaN(y) ? null : Math.floor(y / 10) * 10;
  }).filter(Boolean))].sort((a, b) => b - a);

  // Apply filters
  useEffect(() => {
    let result = [...data];

    if (selectedTheLoai !== "all") {
      result = result.filter(b => {
        if (b.theLoaiList?.length > 0)
          return b.theLoaiList.some(tl => String(tl.maTheLoai) === selectedTheLoai);
        return String(b.maTheLoai) === selectedTheLoai;
      });
    }

    if (selectedNgonNgu !== "all") {
      result = result.filter(b => b.ngonNgu === selectedNgonNgu);
    }

    if (selectedNam !== "all") {
      const decade = parseInt(selectedNam);
      result = result.filter(b => {
        const y = parseInt(b.namXB);
        return !isNaN(y) && y >= decade && y < decade + 10;
      });
    }

    if (sort === "az") result.sort((a, b) => a.tieuDe.localeCompare(b.tieuDe));
    if (sort === "za") result.sort((a, b) => b.tieuDe.localeCompare(a.tieuDe));
    if (sort === "new") result = result.sort((a, b) => (parseInt(b.namXB) || 0) - (parseInt(a.namXB) || 0));

    setFiltered(result);
  }, [data, sort, selectedTheLoai, selectedNgonNgu, selectedNam]);

  const getImageSrc = (hinhAnh) => {
    if (!hinhAnh) return "https://via.placeholder.com/160x220?text=Sách";
    if (hinhAnh.startsWith("http")) return hinhAnh;
    return `${API_BASE}${hinhAnh}`;
  };

  const selectStyle = {
    height: 36, borderRadius: 8, border: "1px solid #d9d9d9",
    padding: "0 10px", fontSize: 14, background: "#fff", cursor: "pointer",
  };

  return (
    <>
      <HeaderUser />
      <div className="search-page">
        {/* HEADER INFO */}
        <div className="search-header">
          <div className="breadcrumb">
            Trang chủ / Tìm kiếm / <span>{keyword}</span>
          </div>
          <h2 className="search-title">
            Kết quả tìm kiếm: <span>{keyword}</span>
          </h2>

          <div className="top-bar" style={{ flexWrap: "wrap", gap: 8 }}>
            <div className="result-count">
              🔍 <span className="count">{filtered.length}</span> sách cho
              <span className="keyword"> "{keyword}"</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {/* Lọc thể loại */}
              <select value={selectedTheLoai} onChange={e => setSelectedTheLoai(e.target.value)} style={selectStyle}>
                <option value="all">Tất cả thể loại</option>
                {theLoais.map(tl => (
                  <option key={tl.maTheLoai} value={tl.maTheLoai}>{tl.tenTheLoai}</option>
                ))}
              </select>

              {/* Lọc ngôn ngữ */}
              {ngonNguList.length > 0 && (
                <select value={selectedNgonNgu} onChange={e => setSelectedNgonNgu(e.target.value)} style={selectStyle}>
                  <option value="all">Tất cả ngôn ngữ</option>
                  {ngonNguList.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              )}

              {/* Lọc thập kỷ */}
              {namDecades.length > 0 && (
                <select value={selectedNam} onChange={e => setSelectedNam(e.target.value)} style={selectStyle}>
                  <option value="all">Tất cả năm</option>
                  {namDecades.map(d => <option key={d} value={d}>{d}s</option>)}
                </select>
              )}

              {/* Sắp xếp */}
              <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
                <option value="relevance">Liên quan</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="new">Mới nhất</option>
              </select>

              {/* Reset */}
              {(selectedTheLoai !== "all" || selectedNgonNgu !== "all" || selectedNam !== "all" || sort !== "relevance") && (
                <button
                  onClick={() => { setSelectedTheLoai("all"); setSelectedNgonNgu("all"); setSelectedNam("all"); setSort("relevance"); }}
                  style={{ height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #ff4d4f", color: "#ff4d4f", background: "#fff", cursor: "pointer", fontSize: 13 }}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#888" }}>Đang tìm kiếm...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>Không tìm thấy sách phù hợp.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map(item => (
              <div key={item.maSach} className="card" onClick={() => navigate(`/sach/${item.maSach}`)}>
                <div className="img-box">
                  <img src={getImageSrc(item.hinhAnh)} alt={item.tieuDe}
                    onError={e => { e.target.src = "https://via.placeholder.com/160x220?text=Sách"; }} />
                </div>
                <div className="info">
                  <h3 className="title" style={{ fontSize: 16, marginBottom: 4, textAlign: "center" }}>{item.tieuDe}</h3>
                  <p className="author" style={{ textAlign: "center" }}>{item.tacGia}</p>
                  {item.namXB && <p style={{ fontSize: 12, color: "#aaa", textAlign: "center" }}>{item.namXB}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginTop: 4 }}>
                    {(item.theLoaiList || []).slice(0, 2).map(tl => (
                      <span key={tl.maTheLoai} className="category" style={{ fontSize: 11 }}>{tl.tenTheLoai}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TimKiemPage;