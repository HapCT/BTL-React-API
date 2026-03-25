using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyThueSach.DAL
{
    public class PhatDAL
    {
        public interface IPhatRepository
        {
            Task<List<PhatViewModel>> GetAsync();
            Task<List<PhatViewModel>> SearchAsync(string keyword, string trangThai);
            Task<int> TaoPhatAsync(TaoPhatRequest request);
            Task<int> ThanhToanPhatAsync(string maPhat);
            Task<int> HuyPhatAsync(string maPhat);
        }

        public class PhatRepository : IPhatRepository
        {
            private readonly string _con;

            public PhatRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

            // 🔹 Hiển thị danh sách phạt (JOIN full)
            public async Task<List<PhatViewModel>> GetAsync()
            {
                var list = new List<PhatViewModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_GetPhatFull", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new PhatViewModel
                    {
                        MaPhat = rd["MaPhat"]?.ToString(),
                        MaPhieuMuon = rd["MaPhieuMuon"]?.ToString(),
                        MaBanDoc = rd["MaBanDoc"]?.ToString(),
                        TenBanDoc = rd["TenBanDoc"]?.ToString(),
                        TenSach = rd["TenSach"]?.ToString(),
                        SoTien = rd["SoTien"] != DBNull.Value ? Convert.ToDecimal(rd["SoTien"]) : 0,
                        LyDoPhat = rd["LyDoPhat"]?.ToString(),
                        NgayTinh = rd["NgayTinh"] != DBNull.Value ? Convert.ToDateTime(rd["NgayTinh"]) : DateTime.MinValue,
                        TrangThai = rd["TrangThai"]?.ToString()
                    });
                }

                return list;
            }

            // 🔹 Tìm kiếm
            public async Task<List<PhatViewModel>> SearchAsync(string keyword, string trangThai)
            {
                var list = new List<PhatViewModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_SearchPhat", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Keyword",
                    string.IsNullOrEmpty(keyword) ? (object)DBNull.Value : keyword);

                cmd.Parameters.AddWithValue("@TrangThai",
                    string.IsNullOrEmpty(trangThai) ? (object)DBNull.Value : trangThai);

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new PhatViewModel
                    {
                        MaPhat = rd["MaPhat"]?.ToString(),
                        MaPhieuMuon = rd["MaPhieuMuon"]?.ToString(),
                        MaBanDoc = rd["MaBanDoc"]?.ToString(),
                        TenBanDoc = rd["TenBanDoc"]?.ToString(),
                        TenSach = rd["TenSach"]?.ToString(),
                        SoTien = rd["SoTien"] != DBNull.Value ? Convert.ToDecimal(rd["SoTien"]) : 0,
                        LyDoPhat = rd["LyDoPhat"]?.ToString(),
                        NgayTinh = rd["NgayTinh"] != DBNull.Value ? Convert.ToDateTime(rd["NgayTinh"]) : DateTime.MinValue,
                        TrangThai = rd["TrangThai"]?.ToString()
                    });
                }

                return list;
            }

            // 🔹 Tạo phạt
            public async Task<int> TaoPhatAsync(TaoPhatRequest request)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("spPhat", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhieuMuon", request.MaPhieuMuon);
                cmd.Parameters.AddWithValue("@LyDoPhat",
                    string.IsNullOrEmpty(request.LyDoPhat) ? (object)DBNull.Value : request.LyDoPhat);

                return await cmd.ExecuteNonQueryAsync();
            }

            // 🔹 Thanh toán phạt
            public async Task<int> ThanhToanPhatAsync(string maPhat)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_ThanhToanPhat", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhat", maPhat);

                return await cmd.ExecuteNonQueryAsync();
            }

            // 🔹 Huỷ phạt
            public async Task<int> HuyPhatAsync(string maPhat)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HuyPhat", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaPhat", maPhat);

                return await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}