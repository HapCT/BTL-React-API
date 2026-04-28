using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace QuanLyThueSach.DAL
{
    public class SachDAL
    {
        public interface ISachRepository
        {
            Task<List<SachModel>> GetAsync();
            Task<int> ThemSach(ThemSach themSach);
            Task<int> SuaSach(string maSach, SuaSach suaSach);
            Task<int> XoaSachAsync(string maSach);
            Task<List<SachModel>> TimSachIDAsync(string maSach);
            Task<List<SachModel>> TimSachAsync(string tuKhoa);
            Task<List<SachPhoBienModel>> GetSachPhoBienAsync();
        }
        public class SachRepository : ISachRepository
        {
            private readonly string _con;

            public SachRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

            public async Task<List<SachModel>> GetAsync()
            {
                var list = new List<SachModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HienThiSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    var tl = rd["TenTheLoai"] == DBNull.Value ? "" : rd["TenTheLoai"].ToString();

                    list.Add(new SachModel
                    {
                        MaSach = rd["MaSach"].ToString(),
                        TieuDe = rd["TieuDe"].ToString(),
                        TacGia = rd["TacGia"].ToString(),
                        NamXB = rd["NamXB"].ToString(),
                        NgonNgu = rd["NgonNgu"].ToString(),
                        SoLuongSach = rd["SoLuongSach"] == DBNull.Value
    ? 0
    : Convert.ToInt32(rd["SoLuongSach"]),
                        HinhAnh = rd["HinhAnh"] == DBNull.Value ? null : rd["HinhAnh"].ToString(),


                        TheLoai = string.IsNullOrWhiteSpace(tl)
    ? new List<string>()
    : tl.Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(x => x.Trim())
        .ToList()
                    });
                }

                return list;
            }

            public async Task<int> ThemSach(ThemSach themSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_ThemSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@DanhSachTheLoai",
                    string.Join(",", themSach.TheLoai ?? new List<string>()));

                cmd.Parameters.AddWithValue("@TieuDe", themSach.TieuDe);
                cmd.Parameters.AddWithValue("@TacGia", themSach.TacGia);
                cmd.Parameters.AddWithValue("@NamXB", themSach.NamXB);
                cmd.Parameters.AddWithValue("@NgonNgu", themSach.NgonNgu);
                cmd.Parameters.AddWithValue("@SoLuongSach", themSach.SoLuongSach);
                cmd.Parameters.AddWithValue("@HinhAnh", themSach.HinhAnh ?? (object)DBNull.Value);

                return await cmd.ExecuteNonQueryAsync();
            }

            public async Task<int> SuaSach(string maSach, SuaSach suaSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_SuaSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach", maSach);
                cmd.Parameters.AddWithValue("@TieuDe", suaSach.TieuDe);
                cmd.Parameters.AddWithValue("@TacGia", suaSach.TacGia);
                cmd.Parameters.AddWithValue("@NamXB", suaSach.NamXB);
                cmd.Parameters.AddWithValue("@NgonNgu", suaSach.NgonNgu);
                cmd.Parameters.AddWithValue("@SoLuongSach", suaSach.SoLuongSach);
                cmd.Parameters.AddWithValue("@HinhAnh", suaSach.HinhAnh ?? (object)DBNull.Value);

                cmd.Parameters.AddWithValue("@DanhSachTheLoai",
                    string.Join(",", suaSach.DanhSachTheLoai ?? new List<string>()));

                return await cmd.ExecuteNonQueryAsync();
            }

            public async Task<int> XoaSachAsync(string maSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_XoaSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach", maSach);

                return await cmd.ExecuteNonQueryAsync();
            }

            public async Task<List<SachModel>> TimSachIDAsync(string maSach)
            {
                var list = new List<SachModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimSachTheoID", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach", maSach);

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    var tl = rd["TenTheLoai"] == DBNull.Value ? "" : rd["TenTheLoai"].ToString();

                    list.Add(new SachModel
                    {
                        MaSach = rd["MaSach"].ToString(),
                        TieuDe = rd["TieuDe"].ToString(),
                        TacGia = rd["TacGia"].ToString(),
                        NamXB = rd["NamXB"].ToString(),
                        NgonNgu = rd["NgonNgu"].ToString(),
                        SoLuongSach = rd["SoLuongSach"] == DBNull.Value
    ? 0
    : Convert.ToInt32(rd["SoLuongSach"]),

                        TheLoai = string.IsNullOrWhiteSpace(tl)
    ? new List<string>()
    : tl.Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(x => x.Trim())
        .ToList()
                    });
                }

                return list;
            }

            public async Task<List<SachModel>> TimSachAsync(string tuKhoa)
            {
                var list = new List<SachModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TuKhoa", tuKhoa);

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    var tl = rd["TenTheLoai"] == DBNull.Value ? "" : rd["TenTheLoai"].ToString();

                    list.Add(new SachModel
                    {
                        MaSach = rd["MaSach"].ToString(),
                        TieuDe = rd["TieuDe"].ToString(),
                        TacGia = rd["TacGia"].ToString(),
                        NamXB = rd["NamXB"].ToString(),
                        NgonNgu = rd["NgonNgu"].ToString(),
                        SoLuongSach = rd["SoLuongSach"] == DBNull.Value
    ? 0
    : Convert.ToInt32(rd["SoLuongSach"]),
                        HinhAnh = rd["HinhAnh"] == DBNull.Value ? null : rd["HinhAnh"].ToString(),

                        TheLoai = string.IsNullOrEmpty(tl)
                            ? new List<string>()
                            : tl.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(x => x.Trim())
                                .ToList()
                    });
                }

                return list;
            }

            public async Task<List<SachPhoBienModel>> GetSachPhoBienAsync()
            {
                var list = new List<SachPhoBienModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                string query = @"SELECT TOP 10
                        s.MaSach, s.TieuDe, s.TacGia,
                        s.NamXB, s.NgonNgu, s.SoLuongSach,
                        s.HinhAnh,
                        COUNT(pm.MaPhieuMuon) AS LuotThue,
                        tl.TenTheLoai
                    FROM Sach s
                    LEFT JOIN TheLoai tl ON s.MaTheLoai = tl.MaTheLoai
                    JOIN BanSao bs ON s.MaSach = bs.MaSach
                    JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
                    WHERE pm.TrangThai = N'Đã trả'
                    GROUP BY s.MaSach, s.TieuDe, s.TacGia,
                             s.NamXB, s.NgonNgu, s.SoLuongSach,
                             s.HinhAnh, tl.TenTheLoai
                    ORDER BY LuotThue DESC";

                using var cmd = new SqlCommand(query, connect);
                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    var tl = rd["TenTheLoai"] == DBNull.Value ? "" : rd["TenTheLoai"].ToString();

                    list.Add(new SachPhoBienModel
                    {
                        MaSach = rd["MaSach"].ToString(),
                        TieuDe = rd["TieuDe"].ToString(),
                        TacGia = rd["TacGia"].ToString(),
                        NamXB = rd["NamXB"].ToString(),
                        NgonNgu = rd["NgonNgu"].ToString(),
                        SoLuongSach = rd["SoLuongSach"] == DBNull.Value
    ? 0
    : Convert.ToInt32(rd["SoLuongSach"]),
                        HinhAnh = rd["HinhAnh"] == DBNull.Value ? null : rd["HinhAnh"].ToString(),
                        LuotThue = rd["LuotThue"] == DBNull.Value ? 0 : Convert.ToInt32(rd["LuotThue"]), 

                        TheLoai = string.IsNullOrEmpty(tl)
                            ? new List<string>()
                            : tl.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(x => x.Trim())
                                .ToList()
                    });
                }

                return list;
            }
        }
    }
}