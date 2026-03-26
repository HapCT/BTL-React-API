using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyThueSach.DAL
{
    public class ThanhToanDAL
    {
        public interface IThanhToanRepository
        {
            Task<List<ThanhToanViewModel>> GetAsync();
            Task<ThanhToanViewModel?> GetHoaDonAsync(string maThanhToan);
            Task<int> HuyThanhToanAsync(string maThanhToan);
        }

        public class ThanhToanRepository : IThanhToanRepository
        {
            private readonly string _con;

            public ThanhToanRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

            // 🔹 Lấy danh sách thanh toán
            public async Task<List<ThanhToanViewModel>> GetAsync()
            {
                var list = new List<ThanhToanViewModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_GetThanhToan", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new ThanhToanViewModel
                    {
                        MaThanhToan = rd["MaThanhToan"]?.ToString(),
                        TenBanDoc = rd["TenBanDoc"]?.ToString(),
                        SoDienThoai = rd["SoDienThoai"]?.ToString(), // nếu SP có
                        NgayThanhToan = rd["NgayThanhToan"] != DBNull.Value ? Convert.ToDateTime(rd["NgayThanhToan"]) : DateTime.MinValue,
                        SoTien = rd["SoTien"] != DBNull.Value ? Convert.ToDecimal(rd["SoTien"]) : 0,
                        HinhThucThanhToan = rd["HinhThucThanhToan"]?.ToString(),
                        GhiChu = rd["GhiChu"]?.ToString(),
                        TrangThai = rd["TrangThai"]?.ToString()
                    });
                }

                return list;
            }

            // 🔹 Lấy hoá đơn theo mã
            public async Task<ThanhToanViewModel?> GetHoaDonAsync(string maThanhToan)
            {
                ThanhToanViewModel? model = null;

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_GetHoaDon", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaThanhToan", maThanhToan);

                using var rd = await cmd.ExecuteReaderAsync();

                if (await rd.ReadAsync())
                {
                    model = new ThanhToanViewModel
                    {
                        MaThanhToan = rd["MaThanhToan"]?.ToString(),
                        TenBanDoc = rd["HoTen"]?.ToString(),
                        SoDienThoai = rd["SoDienThoai"]?.ToString(),
                        NgayThanhToan = rd["NgayThanhToan"] != DBNull.Value ? Convert.ToDateTime(rd["NgayThanhToan"]) : DateTime.MinValue,
                        SoTien = rd["SoTien"] != DBNull.Value ? Convert.ToDecimal(rd["SoTien"]) : 0,
                        HinhThucThanhToan = rd["HinhThucThanhToan"]?.ToString(),
                        GhiChu = rd["GhiChu"]?.ToString(),
                        TrangThai = rd["TrangThai"]?.ToString()
                    };
                }

                return model;
            }

            // 🔹 Huỷ thanh toán
            public async Task<int> HuyThanhToanAsync(string maThanhToan)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HuyThanhToan", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaThanhToan", maThanhToan);

                return await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}