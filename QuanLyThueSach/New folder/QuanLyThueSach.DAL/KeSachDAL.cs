using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyThueSach.DAL
{
    public class KeSachDAL
    {
        public interface IKeSachRepository
        {
            Task<List<KeSachModel>> GetAsync();
            Task<int> ThemKeAsync(ThemKeSach themKeSach);
            Task<List<KeSachModel>> TimKeIdAsync(string maKe);
            Task<List<KeSachModel>> SearchAsync(string tuKhoa);
            Task<int> SuaKeAsync(string maKe, SuaKeSach suaKeSach);
            Task<int> XoaKeAsync(string maKe);
        }

        public class KeSachRepository : IKeSachRepository
        {
            private readonly string _con;

            public KeSachRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

            // Hiển thị tất cả kệ sách
            public async Task<List<KeSachModel>> GetAsync()
            {
                var list = new List<KeSachModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HienThiKeSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new KeSachModel
                    {
                        MaKe = rd.GetString(0),
                        TenKe = rd.IsDBNull(1) ? null : rd.GetString(1),
                        ViTri = rd.IsDBNull(2) ? null : rd.GetString(2)
                    });
                }

                return list;
            }

            // Thêm kệ sách
            public async Task<int> ThemKeAsync(ThemKeSach themKeSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_ThemKeSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TenKe", themKeSach.TenKe);
                cmd.Parameters.AddWithValue("@ViTri", themKeSach.ViTri);

                return await cmd.ExecuteNonQueryAsync();
            }

            // Tìm theo ID
            public async Task<List<KeSachModel>> TimKeIdAsync(string maKe)
            {
                var list = new List<KeSachModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimKeSachTheoID", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaKe", maKe);

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new KeSachModel
                    {
                        MaKe = rd.GetString(0),
                        TenKe = rd.IsDBNull(1) ? null : rd.GetString(1),
                        ViTri = rd.IsDBNull(2) ? null : rd.GetString(2)
                    });
                }

                return list;
            }

            // Tìm kiếm
            public async Task<List<KeSachModel>> SearchAsync(string tuKhoa)
            {
                var list = new List<KeSachModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimKeSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TuKhoa", tuKhoa);

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new KeSachModel
                    {
                        MaKe = rd.GetString(0),
                        TenKe = rd.IsDBNull(1) ? null : rd.GetString(1),
                        ViTri = rd.IsDBNull(2) ? null : rd.GetString(2)
                    });
                }

                return list;
            }

            // Sửa kệ sách
            public async Task<int> SuaKeAsync(string maKe, SuaKeSach suaKeSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_SuaKeSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaKe", maKe);
                cmd.Parameters.AddWithValue("@TenKe", suaKeSach.TenKe);
                cmd.Parameters.AddWithValue("@ViTri", suaKeSach.ViTri);

                return await cmd.ExecuteNonQueryAsync();
            }

            // Xóa kệ sách
            public async Task<int> XoaKeAsync(string maKe)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_XoaKeSach", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaKe", maKe);

                return await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}