using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class DatChoModel
    {
        public string MaDatCho { get; set; }

        public string MaSach { get; set; }

        public string MaBanDoc { get; set; }

        public DateTime ThoiGianGiuCho { get; set; }

        public string TrangThai { get; set; }

        public int ThuTu { get; set; }
    }
    public class TaoDatChoRequest   
    {
        public string MaSach { get; set; }

        public string MaBanDoc { get; set; }
    }
    public class DatChoViewModel
    {
        public string MaDatCho { get; set; }

        public string MaSach { get; set; }
        public string TenSach { get; set; }

        public string MaBanDoc { get; set; }
        public string TenBanDoc { get; set; }

        public DateTime ThoiGianGiuCho { get; set; }

        public string TrangThai { get; set; }

        public int ThuTu { get; set; }
    }
}
