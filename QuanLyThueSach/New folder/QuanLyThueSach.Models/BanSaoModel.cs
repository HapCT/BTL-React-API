using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class BanSaoModel
    {
        public string MaBanSao { get; set; }
        public string MaSach { get; set; }
        public string TieuDe { get; set; }
        public string MaKe { get; set; }
        public string TenKe { get; set; }
        public string TrangThai { get; set; }
    }
    public class ThemBanSao
    {
        public string MaSach { get; set; }
        public int SoLuong { get; set; }
    }
    public class SuaBanSao
    {
        public string MaSach { get; set; }
        public string MaKe { get; set; }
        public string TrangThai { get; set; }
    }
    public class XoaNhieuBanSao
    {
        public List<string> DanhSachMaBanSao { get; set; }
    }
}
