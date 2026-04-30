using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

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
            Task<SachModel> TimSachIDAsync(string maSach);
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

            // Hàm helper: parse "TL001:Văn học,TL002:Khoa học" → List<TheLoaiInfo>
            private static List<TheLoaiInfo> ParseTheLoai(string raw)
            {
                if (string.IsNullOrWhiteSpace(raw)) return new List<TheLoaiInfo>();

                return raw.Split(',', System.StringSplitOptions.RemoveEmptyEntries)
                    .Select(entry =>
                    {
                        var parts = entry.Trim().Split(':', 2);
                        return new TheLoaiInfo
                        {
                            MaTheLoai  = parts.Length > 0 ? parts[0].Trim() : "",
                            TenTheLoai = parts.Length > 1 ? parts[1].Trim() : parts[0].Trim()
                        };
                    })
                    .Where(x => !string.IsNullOrEmpty(x.MaTheLoai))
                    .ToList();
            }

            // Đọc 1 SachModel từ DataReader
            private static SachModel ReadSach(SqlDataReader rd)
            {
                var raw = rd["DanhSachTheLoai"] == DBNull.Value ? "" : rd["DanhSachTheLoai"].ToString();
                return new SachModel
                {
                    MaSach       = rd["MaSach"].ToString(),
                    TieuDe       = rd["TieuDe"].ToString(),
                    TacGia       = rd["TacGia"].ToString(),
                    NamXB        = rd["NamXB"].ToString(),
                    NgonNgu      = rd["NgonNgu"].ToString(),
                    SoLuongSach  = rd["SoLuongSach"] == DBNull.Value ? 0 : System.Convert.ToInt32(rd["SoLuongSach"]),
                    HinhAnh      = rd["HinhAnh"] == DBNull.Value ? null : rd["HinhAnh"].ToString(),
                    TheLoaiList  = ParseTheLoai(raw)
                };
            }

            // GET ALL
            public async Task<List<SachModel>> GetAsync()
            {
                var list = new List<SachModel>();
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_HienThiSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                    list.Add(ReadSach(rd));
                return list;
            }

            // THÊM SÁCH
            public async Task<int> ThemSach(ThemSach themSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_ThemSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@DanhSachTheLoai",
                    string.Join(",", themSach.DanhSachTheLoai ?? new List<string>()));
                cmd.Parameters.AddWithValue("@TieuDe",      themSach.TieuDe ?? "");
                cmd.Parameters.AddWithValue("@TacGia",      themSach.TacGia ?? "");
                cmd.Parameters.AddWithValue("@NamXB",       themSach.NamXB  ?? "");
                cmd.Parameters.AddWithValue("@NgonNgu",     themSach.NgonNgu ?? "");
                cmd.Parameters.AddWithValue("@SoLuongSach", themSach.SoLuongSach);
                cmd.Parameters.AddWithValue("@HinhAnh",     (object?)themSach.HinhAnh ?? DBNull.Value);

                return await cmd.ExecuteNonQueryAsync();
            }

            // SỬA SÁCH
            public async Task<int> SuaSach(string maSach, SuaSach suaSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_SuaSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach",          maSach);
                cmd.Parameters.AddWithValue("@TieuDe",          suaSach.TieuDe  ?? "");
                cmd.Parameters.AddWithValue("@TacGia",          suaSach.TacGia  ?? "");
                cmd.Parameters.AddWithValue("@NamXB",           suaSach.NamXB   ?? "");
                cmd.Parameters.AddWithValue("@NgonNgu",         suaSach.NgonNgu ?? "");
                cmd.Parameters.AddWithValue("@SoLuongSach",     suaSach.SoLuongSach);
                cmd.Parameters.AddWithValue("@HinhAnh",         (object?)suaSach.HinhAnh ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DanhSachTheLoai",
                    string.Join(",", suaSach.DanhSachTheLoai ?? new List<string>()));

                return await cmd.ExecuteNonQueryAsync();
            }

            // XÓA SÁCH
            public async Task<int> XoaSachAsync(string maSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_XoaSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaSach", maSach);
                return await cmd.ExecuteNonQueryAsync();
            }

            // TÌM THEO ID
            public async Task<SachModel> TimSachIDAsync(string maSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_TimSachTheoID", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaSach", maSach);
                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync()) return ReadSach(rd);
                return null;
            }

            // TÌM THEO TỪ KHÓA
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
                    list.Add(ReadSach(rd));
                return list;
            }

            // SÁCH PHỔ BIẾN
            public async Task<List<SachPhoBienModel>> GetSachPhoBienAsync()
            {
                var list = new List<SachPhoBienModel>();
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                string query = @"
                    SELECT TOP 10
                        s.MaSach, s.TieuDe, s.TacGia,
                        s.NamXB, s.NgonNgu, s.SoLuongSach,
                        s.HinhAnh,
                        COUNT(pm.MaPhieuMuon) AS LuotThue,
                        STUFF((
                            SELECT ',' + stl2.MaTheLoai + ':' + tl2.TenTheLoai
                            FROM SachTheLoai stl2
                            JOIN TheLoai tl2 ON stl2.MaTheLoai = tl2.MaTheLoai
                            WHERE stl2.MaSach = s.MaSach
                            FOR XML PATH(''), TYPE
                        ).value('.','NVARCHAR(MAX)'), 1, 1, '') AS DanhSachTheLoai
                    FROM Sach s
                    JOIN BanSao bs ON s.MaSach = bs.MaSach
                    JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
                    WHERE pm.TrangThai = N'Đã trả'
                    GROUP BY s.MaSach, s.TieuDe, s.TacGia,
                             s.NamXB, s.NgonNgu, s.SoLuongSach, s.HinhAnh
                    ORDER BY LuotThue DESC";

                using var cmd = new SqlCommand(query, connect);
                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    var raw = rd["DanhSachTheLoai"] == DBNull.Value ? "" : rd["DanhSachTheLoai"].ToString();
                    list.Add(new SachPhoBienModel
                    {
                        MaSach      = rd["MaSach"].ToString(),
                        TieuDe      = rd["TieuDe"].ToString(),
                        TacGia      = rd["TacGia"].ToString(),
                        NamXB       = rd["NamXB"].ToString(),
                        NgonNgu     = rd["NgonNgu"].ToString(),
                        SoLuongSach = rd["SoLuongSach"] == DBNull.Value ? 0 : System.Convert.ToInt32(rd["SoLuongSach"]),
                        HinhAnh     = rd["HinhAnh"] == DBNull.Value ? null : rd["HinhAnh"].ToString(),
                        LuotThue    = rd["LuotThue"] == DBNull.Value ? 0 : System.Convert.ToInt32(rd["LuotThue"]),
                        TheLoaiList = ParseTheLoai(raw)
                    });
                }

                return list;
            }
        }
    }
}
