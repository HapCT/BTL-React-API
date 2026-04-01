using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class PhieuMuonModel
    {
        public string MaPhieuMuon { get; set; }
        public string MaDocGia { get; set; }
        public string TenDocGia { get; set; }
        public DateTime? NgayMuon { get; set; }
        public DateTime HanTra { get; set; }
        public int SoLanGiaHan { get; set; }
        public string TrangThai { get; set; }
    }
    public class ThemPhieuMuon
    {
        public string MaBanDoc { get; set; }
        public string MaBanSao { get; set; }
        public DateTime? NgayMuon { get; set; }
        public DateTime HanTra { get; set; }
        public int SoLanGiaHan { get; set; }
        public string TrangThai { get; set; }
    }
    public class TraSach 
    {
        public DateTime NgayTra { get; set; }
    }
    public class GiaHanPhieuMuon
    {
        public int SoNgayThem { get; set; }
    }
    public class MuonOline
    {
        public string MaBanDoc { get; set; }
        public string MaBanSao { get; set; } 
        public DateTime HanTra { get; set; }
    }
    public class TaoPhieuMuonOfflineRequest
    {
        public string MaBanDoc { get; set; }
        public string MaBanSao { get; set; }
        public DateTime HanTra { get; set; }
    }
    public class PhieuMuonViewModel
    {
        public string MaPhieuMuon { get; set; }
        public string TenBanDoc { get; set; }
        public string TenSach { get; set; }

        public DateTime? NgayMuon { get; set; }
        public DateTime HanTra { get; set; }

        public string TrangThai { get; set; }
    }
}
