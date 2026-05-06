using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class PhatModel
    {
        public string MaPhat { get; set; }
        public string MaPhieuMuon { get; set; }
        public decimal SoTien { get; set; }
        public string LyDoPhat { get; set; }
        public DateTime? NgayTinh { get; set; }
        public string TrangThai { get; set; }

    }
    public class PhatViewModel
    {
        public string MaPhat { get; set; }

        public string MaPhieuMuon { get; set; }

        public string MaBanDoc { get; set; }

        public string TenBanDoc { get; set; }

        public string TenSach { get; set; }

        public decimal SoTien { get; set; }

        public string LyDoPhat { get; set; }

        public DateTime NgayTinh { get; set; }

        public string TrangThai { get; set; }
    }
    public class TaoPhatRequest
    {
        public string MaPhieuMuon { get; set; }

        public string LyDoPhat { get; set; }
    }
}
