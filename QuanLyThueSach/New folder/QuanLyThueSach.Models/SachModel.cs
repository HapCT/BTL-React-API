using System.Collections.Generic;

namespace QuanLyThueSach.Models
{
    // DTO thể loại gắn với sách
    public class TheLoaiInfo
    {
        public string MaTheLoai { get; set; }
        public string TenTheLoai { get; set; }
    }

    public class SachModel
    {
        public string MaSach { get; set; }
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string HinhAnh { get; set; }

        // Danh sách thể loại (nhiều-nhiều)
        public List<TheLoaiInfo> TheLoaiList { get; set; } = new();
    }

    public class ThemSach
    {
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string? HinhAnh { get; set; }

        // Danh sách mã thể loại: ["TL001","TL002"]
        public List<string> DanhSachTheLoai { get; set; } = new();
    }

    public class SuaSach
    {
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string? HinhAnh { get; set; }
        public string? HinhAnhCu { get; set; }

        // Danh sách mã thể loại mới
        public List<string> DanhSachTheLoai { get; set; } = new();
    }

    public class SachPhoBienModel : SachModel
    {
        public int LuotThue { get; set; }
    }
}
