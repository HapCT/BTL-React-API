using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;

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
                    list.Add(new SachModel
                    {
                        MaTheLoai = rd.GetString(0),
                        TenTheLoai = rd.IsDBNull(1) ? null : rd.GetString(1),
                        MaSach = rd.GetString(2),
                        TieuDe = rd.GetString(3),
                        TacGia = rd.GetString(4),
                        NamXB = rd.GetString(5),
                        NgonNgu = rd.GetString(6),
                        SoLuongSach = rd.GetInt32(7)
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

                cmd.Parameters.AddWithValue("@MaTheLoai", themSach.MaTheLoai);
                cmd.Parameters.AddWithValue("@TieuDe", themSach.TieuDe);
                cmd.Parameters.AddWithValue("@TacGia", themSach.TacGia);
                cmd.Parameters.AddWithValue("@NamXB", themSach.NamXB);
                cmd.Parameters.AddWithValue("@NgonNgu", themSach.NgonNgu);
                cmd.Parameters.AddWithValue("@SoLuongSach", themSach.SoLuongSach);

                return await cmd.ExecuteNonQueryAsync();
            }

            public async Task<int> SuaSach(string maSach, SuaSach suaSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_SuaSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach", maSach);
                cmd.Parameters.AddWithValue("@MaTheLoai", suaSach.MaTheLoai);
                cmd.Parameters.AddWithValue("@TieuDe", suaSach.TieuDe);
                cmd.Parameters.AddWithValue("@TacGia", suaSach.TacGia);
                cmd.Parameters.AddWithValue("@NamXB", suaSach.NamXB);
                cmd.Parameters.AddWithValue("@NgonNgu", suaSach.NgonNgu);
                cmd.Parameters.AddWithValue("@SoLuongSach", suaSach.SoLuongSach);

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
                    list.Add(new SachModel
                    {
                        MaSach = rd["MaSach"].ToString(),
                        TieuDe = rd["TieuDe"].ToString(),
                        TacGia = rd["TacGia"].ToString(),
                        MaTheLoai = rd["MaTheLoai"].ToString(),
                        TenTheLoai = rd["TenTheLoai"]?.ToString(),
                        NamXB = rd["NamXB"].ToString(),
                        NgonNgu = rd["NgonNgu"].ToString(),
                        SoLuongSach = Convert.ToInt32(rd["SoLuongSach"])
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
                    list.Add(new SachModel
                    {
                        MaTheLoai = rd.GetString(0),
                        TenTheLoai = rd.IsDBNull(1) ? null : rd.GetString(1),
                        MaSach = rd.GetString(2),
                        TieuDe = rd.GetString(3),
                        TacGia = rd.GetString(4),
                        NamXB = rd.GetString(5),
                        NgonNgu = rd.GetString(6),
                        SoLuongSach = rd.GetInt32(7)
                    });
                }

                return list;
            }
        }
    }
}