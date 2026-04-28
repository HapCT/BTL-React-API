using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace QuanLyThueSach.Models
{
    public class SachModel
    {
        public string MaSach { get; set; }
        public string TieuDe { get; set; }
        public string TacGia { get; set; }

        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string HinhAnh { get; set; }

        // 🔥 thêm danh sách thể loại
        public List<string> TheLoai { get; set; }
    }
    public class ThemSach
    {
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string? HinhAnh { get; set; }

        // 🔥 nhiều thể loại
        public List<string> TheLoai { get; set; }
    }
    public class SuaSach
    {
        public string MaSach { get; set; }

        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }

        public string? HinhAnh { get; set; }
        public string? HinhAnhCu { get; set; }

        // 🔥 nhiều thể loại
        public List<string> DanhSachTheLoai { get; set; }
    }
    public class SachPhoBienModel : SachModel
    {
        public int LuotThue { get; set; }
    }
}
