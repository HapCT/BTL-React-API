using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;

namespace QuanLyThueSach.DAL
{
    public class BanSaoDAL
    {
        public interface IBanSaoRepository
        {
            Task<List<BanSaoModel>> GetAsync();
            Task<int> ThemBanSaoAsync(ThemBanSao themBanSao);
            Task<List<BanSaoModel>> TimBanSaoIDAsync(string maBanSao);
            Task<List<BanSaoModel>> SearchAsync(string tuKhoa);
            Task<int> SuaBanSaoAsync(string maBanSao, SuaBanSao suaBanSao);
            Task<int> XoaNhieuAsync(List<string> dsMaBanSao);
        }

        public class BanSaoRepository : IBanSaoRepository
        {
            private readonly string _con;

            public BanSaoRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

            // Hiển thị danh sách bản sao
            public async Task<List<BanSaoModel>> GetAsync()
            {
                var list = new List<BanSaoModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HienThiBanSao", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new BanSaoModel
                    {
                        MaBanSao = rd.GetString(0),
                        MaSach = rd.GetString(1),
                        TieuDe = rd.IsDBNull(2) ? null : rd.GetString(2),
                        MaKe = rd.GetString(3),
                        TenKe = rd.IsDBNull(4) ? null : rd.GetString(4),
                        TrangThai = rd.GetString(5)
                    });
                }

                return list;
            }

            // Thêm bản sao
            public async Task<int> ThemBanSaoAsync(ThemBanSao themBanSao)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_ThemBanSao", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach", themBanSao.MaSach);
                cmd.Parameters.AddWithValue("@SoLuong", themBanSao.SoLuong);

                return await cmd.ExecuteNonQueryAsync();
            }

            // Tìm theo ID
            public async Task<List<BanSaoModel>> TimBanSaoIDAsync(string maBanSao)
            {
                var list = new List<BanSaoModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimBanSaoTheoID", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new BanSaoModel
                    {
                        MaBanSao = rd.GetString(0),
                        MaSach = rd.GetString(1),
                        TieuDe = rd.IsDBNull(2) ? null : rd.GetString(2),
                        MaKe = rd.GetString(3),
                        TenKe = rd.IsDBNull(4) ? null : rd.GetString(4),
                        TrangThai = rd.GetString(5)
                    });
                }

                return list;
            }

            // Tìm kiếm
            public async Task<List<BanSaoModel>> SearchAsync(string tuKhoa)
            {
                var list = new List<BanSaoModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimBanSao", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TuKhoa", tuKhoa);

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new BanSaoModel
                    {
                        MaBanSao = rd.GetString(0),
                        MaSach = rd.GetString(1),
                        TieuDe = rd.IsDBNull(2) ? null : rd.GetString(2),
                        MaKe = rd.GetString(3),
                        TenKe = rd.IsDBNull(4) ? null : rd.GetString(4),
                        TrangThai = rd.GetString(5)
                    });
                }

                return list;
            }

            // Sửa bản sao
            public async Task<int> SuaBanSaoAsync(string maBanSao, SuaBanSao suaBanSao)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_SuaBanSao", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaBanSao", maBanSao); 
                cmd.Parameters.AddWithValue("@MaSach", suaBanSao.MaSach);
                cmd.Parameters.AddWithValue("@MaKe", suaBanSao.MaKe);
                cmd.Parameters.AddWithValue("@TrangThai", suaBanSao.TrangThai);

                return await cmd.ExecuteNonQueryAsync();
            }

            // Xóa bản sao
            public async Task<int> XoaNhieuAsync(List<string> dsMaBanSao)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                DataTable table = new DataTable();
                table.Columns.Add("MaBanSao", typeof(string));

                foreach (var item in dsMaBanSao)
                {
                    Console.WriteLine("Add: " + item);
                    table.Rows.Add(item);
                }

                Console.WriteLine("Total rows: " + table.Rows.Count);

                using var cmd = new SqlCommand("sp_XoaNhieuBanSao", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                var param = new SqlParameter("@DanhSachID", SqlDbType.Structured)
                {
                    TypeName = "BanSaoIDList",
                    Value = table
                };

                cmd.Parameters.Add(param);

                var result = await cmd.ExecuteNonQueryAsync();
                Console.WriteLine("Rows affected: " + result);

                return result;
            }
        }
    }
}