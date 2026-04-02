using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class TaiKhoanModel
    {
        public  string TenTaiKhoan { get; set; } 
        public string MatKhau { get; set; }
        public string VaiTro { get; set; }
        public string? HoTen { get; set; }

    }
    public class DangKyModel
    {
        public string TenTaiKhoan { get; set; } = default!;
        public string MatKhau { get; set; } = default!;
        public string HoTen { get; set; } = default!;
        public string CCCD { get; set; } = default!;
        public string SoDienThoai { get; set; } = default!;
        public string Email { get; set; } = default!;
    }
    public class DangNhapModel
    {
        public string TenTaiKhoan { get; set; } = default!;
        public string MatKhau { get; set; } = default!;
    }
    public class CreateTaiKhoan
    {
        public string TenTaiKhoan { get; set; } 
        public string MatKhau { get; set; } 
        public string VaiTro { get; set; } 
    }
    public class DoiMatKhauModel
    {
        public string TenTaiKhoan { get; set; } = default!;
        public string MatKhauCu { get; set; } = default!;
        public string MatKhauMoi { get; set; } = default!;
    }
}
