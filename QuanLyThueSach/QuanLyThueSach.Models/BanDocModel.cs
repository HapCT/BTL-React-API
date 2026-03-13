using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class BanDocModel
    {
        public string MaBanDoc { get; set; }
        public string SoThe { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public DateTime HanThe { get; set; }
        public string TrangThaiThe { get; set; }
        public decimal DuNo { get; set; }
        public string CCCD { get; set; }
    }
    public class CreateBanDoc
    {
        public string HoTen { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SoDienThoai { get; set; } = default!;
        public DateTime HanThe { get; set; } 
        public string CCCD { get; set; } = default!;

    }
    public class UpdateBanDoc
    {
        public string Hoten { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SoDienThoai { get; set; } = default!;
        public DateTime HanThe { get; set;} = default!;
        public string TrangThaiThe { get; set; } = default!;
        public decimal DuNo { get; set; } = default!;
        public string CCCD { get; set; } = default!;

    }
}
