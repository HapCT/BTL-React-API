using System;
using System.Collections.Generic;

namespace QuanLyThueSach.Models
{
    // Model hiển thị danh sách hóa đơn nhập
    public class HoaDonNhapModel
    {
        public string MaHoaDonNhap { get; set; }
        public string NhaCungCap { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime NgayNhap { get; set; }
        public decimal TongTien { get; set; }
        public string GhiChu { get; set; }
        public int SoSach { get; set; }  // Số dòng sách trong hóa đơn
        public List<ChiTietHoaDonNhapModel> ChiTiet { get; set; } = new();
    }

    // Chi tiết từng dòng sách trong hóa đơn
    public class ChiTietHoaDonNhapModel
    {
        public string MaSach { get; set; }
        public string TenSach { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }

    // Request tạo/sửa hóa đơn nhập
    public class HoaDonNhapRequest
    {
        public string NhaCungCap { get; set; }
        public string NguoiNhap { get; set; }
        public DateTime NgayNhap { get; set; }
        public decimal TongTien { get; set; }
        public string GhiChu { get; set; }
        public List<ChiTietRequest> ChiTiet { get; set; } = new();
    }

    public class ChiTietRequest
    {
        public string MaSach { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }
}
