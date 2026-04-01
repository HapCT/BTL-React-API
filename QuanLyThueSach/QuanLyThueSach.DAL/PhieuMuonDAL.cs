using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyThueSach.DAL
{
    public class PhieuMuonDAL
    {
        public interface IPhieuMuonRepository
        {
            Task<List<PhieuMuonViewModel>> GetAsync();
            Task<List<PhieuMuonViewModel>> TimTheoBanDocAsync(string maBanDoc);
            Task<int> DangKyMuonAsync(MuonOline muonOnline);
            Task<int> DangKyMuonOff (TaoPhieuMuonOfflineRequest request);
            Task<int> DuyetMuonAsync(string maPhieuMuon);
            Task<int> TraSachAsync(string maPhieuMuon);
            Task<int> GiaHanAsync(string maPhieuMuon, int soNgayThem);
            Task<int> HuyAsync(string maPhieuMuon);
            Task<bool> XoaPhieuMuon(string maPhieuMuon);
            Task<HoaDonModel> TinhTienAsync(string maPhieuMuon);
        }

        public class PhieuMuonRepository : IPhieuMuonRepository
        {
            private readonly string _con;

            public PhieuMuonRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }
            public async Task<HoaDonModel> TinhTienAsync(string maPhieuMuon)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TinhTien", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                using var rd = await cmd.ExecuteReaderAsync();

                if (await rd.ReadAsync())
                {
                    return new HoaDonModel
                    {
                        TienThue = rd.GetDecimal(0),
                        TienPhat = rd.GetDecimal(1),
                        TongTien = rd.GetDecimal(2)
                    };
                }

                return null;
            }
            // 🔹 Hiển thị tất cả (JOIN ra ViewModel)
            public async Task<List<PhieuMuonViewModel>> GetAsync()
            {

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using (var cmdCheck = new SqlCommand("sp_KiemTraQuaHan", connect))
                {
                    cmdCheck.CommandType = CommandType.StoredProcedure;
                    await cmdCheck.ExecuteNonQueryAsync();
                }

                using var cmd = new SqlCommand("sp_HienThiPhieuMuon", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                
                var list = new List<PhieuMuonViewModel>();
                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new PhieuMuonViewModel
                    {
                        MaPhieuMuon = rd.GetString(0),
                        TenBanDoc = rd.GetString(1),
                        TenSach = rd.GetString(2),
                        NgayMuon = rd.IsDBNull(3) ? null : rd.GetDateTime(3),
                        HanTra = rd.GetDateTime(4),
                        TrangThai = rd.GetString(5)
                    });
                }

                return list;
            }

            // 🔹 Tìm theo bạn đọc
            public async Task<List<PhieuMuonViewModel>> TimTheoBanDocAsync(string maBanDoc)
            {
                var list = new List<PhieuMuonViewModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_XemPhieuMuonTheoBanDoc", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new PhieuMuonViewModel
                    {
                        MaPhieuMuon = rd.GetString(0),
                        TenBanDoc = rd.GetString(1),
                        TenSach = rd.GetString(2),
                        NgayMuon = rd.IsDBNull(3) ? null : rd.GetDateTime(3),
                        HanTra = rd.GetDateTime(4),
                        TrangThai = rd.GetString(5)
                    });
                }

                return list;
            }

            // 🔹Đăng ký mượn (online)
            public async Task<int> DangKyMuonAsync(MuonOline muonOnline)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_DangKyMuon", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaBanDoc", muonOnline.MaBanDoc);
                cmd.Parameters.AddWithValue("@MaBanSao", muonOnline.MaBanSao);
                cmd.Parameters.AddWithValue("@HanTra", muonOnline.HanTra);

                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<int> DangKyMuonOff(TaoPhieuMuonOfflineRequest request)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_DangKyMuonOffline", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaBanDoc", request.MaBanDoc);
                cmd.Parameters.AddWithValue("@MaBanSao", request.MaBanSao);
                cmd.Parameters.AddWithValue("@HanTra", request.HanTra);
                return await cmd.ExecuteNonQueryAsync();
            }
            //  Duyệt mượn
            public async Task<int> DuyetMuonAsync(string maPhieuMuon)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_DuyetMuon", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                return await cmd.ExecuteNonQueryAsync();
            }

            //  Trả sách
            public async Task<int> TraSachAsync(string maPhieuMuon)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TraSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                return await cmd.ExecuteNonQueryAsync();
            }

            //  Gia hạn
            public async Task<int> GiaHanAsync(string maPhieuMuon, int soNgayThem)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_GiaHan", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);
                cmd.Parameters.AddWithValue("@SoNgayThem", soNgayThem);

                return await cmd.ExecuteNonQueryAsync();
            }

            //  Hủy phiếu
            public async Task<int> HuyAsync(string maPhieuMuon)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HuyPhieuMuon", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<bool> XoaPhieuMuon(string maPhieuMuon)
            {
                using var conn = new SqlConnection(_con);
                await conn.OpenAsync();

                using var cmd = new SqlCommand("sp_XoaPhieuMuon", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
                catch
                {
                    return false;
                }
            }

        }
    }
}