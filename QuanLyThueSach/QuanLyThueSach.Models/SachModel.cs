using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
namespace QuanLyThueSach.Models
{
    public class SachModel
    {
        public string MaSach { get; set; }
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string MaTheLoai { get; set; }
        public string TenTheLoai { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string HinhAnh { get; set; }
    }
    public class ThemSach
    {
        public string MaTheLoai { get; set; }
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string HinhAnh { get; set; }
    }
    public class SuaSach
    {
        public string MaTheLoai { get; set; }
        public string TieuDe { get; set; }
        public string TacGia { get; set; }
        public string NamXB { get; set; }
        public string NgonNgu { get; set; }
        public int SoLuongSach { get; set; }
        public string HinhAnh { get; set; }
    }
}
