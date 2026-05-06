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

    public class DatChoKetQua
    {
        // Kết quả trả về từ Stored Procedure (vd: "DAT_CHO", "MUON_NGAY", "LOI", ...)
        public string KetQua { get; set; }

        // Thông báo hiển thị cho người dùng
        public string ThongBao { get; set; }

        // Tính tự động từ KetQua — tương thích với code cũ dùng ThanhCong
        public bool ThanhCong => !string.IsNullOrEmpty(KetQua) && KetQua != "LOI";

        public int MaDatCho { get; set; }
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