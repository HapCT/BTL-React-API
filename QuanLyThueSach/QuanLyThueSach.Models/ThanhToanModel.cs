using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class ThanhToanModel
    {
        public string MaThanhToan { get; set; }

        public string MaBanDoc { get; set; }

        public DateTime NgayThanhToan { get; set; }

        public decimal SoTien { get; set; }

        public string HinhThucThanhToan { get; set; }

        public string GhiChu { get; set; }

        public string TrangThai { get; set; }
    }
    public class ThanhToanViewModel
    {
        public string MaThanhToan { get; set; }

        public string MaBanDoc { get; set; }

        public string TenBanDoc { get; set; }

        public string SoDienThoai { get; set; }

        public DateTime NgayThanhToan { get; set; }

        public decimal SoTien { get; set; }

        public string HinhThucThanhToan { get; set; }

        public string GhiChu { get; set; }

        public string TrangThai { get; set; }
    }
    public class ThanhToanRequest
    {
        public string MaPhieuMuon { get; set; }

        public string HinhThucThanhToan { get; set; }
        public string GhiChu { get; set; }
    }
}
