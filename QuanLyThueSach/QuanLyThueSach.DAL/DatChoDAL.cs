using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyThueSach.DAL
{
    public class DatChoDAL
    {
        public interface IDatChoRepository
        {
            Task<List<DatChoViewModel>> GetAsync();
            Task<int> DatChoAsync(TaoDatChoRequest request);
            Task<int> HuyDatChoAsync(string maDatCho);
            Task<int> HetHanDatChoAsync();
            Task<int> TuDongMuonAsync(string maSach);
        }

        public class DatChoRepository : IDatChoRepository
        {
            private readonly string _con;

            public DatChoRepository(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

            // 🔹 Hiển thị danh sách đặt chỗ
            public async Task<List<DatChoViewModel>> GetAsync()
            {
                var list = new List<DatChoViewModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_LayDanhSachDatCho", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (rd.Read())
                {
                    list.Add(new DatChoViewModel
                    {
                        MaDatCho = rd.GetString(0),
                        MaSach = rd.GetString(1),
                        TenSach = rd.GetString(2),
                        MaBanDoc = rd.GetString(3),
                        TenBanDoc = rd.GetString(4),
                        ThoiGianGiuCho = rd.GetDateTime(5),
                        TrangThai = rd.GetString(6),
                        ThuTu = rd.GetInt32(7)
                    });
                }

                return list;
            }

            // 🔹 Đặt chỗ
            public async Task<int> DatChoAsync(TaoDatChoRequest request)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_DatCho", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaBanDoc", request.MaBanDoc);
                cmd.Parameters.AddWithValue("@MaSach", request.MaSach);

                return await cmd.ExecuteNonQueryAsync();
            }

            // 🔹 Huỷ đặt chỗ
            public async Task<int> HuyDatChoAsync(string maDatCho)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HuyDatCho", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaDatCho", maDatCho);

                return await cmd.ExecuteNonQueryAsync();
            }

            // 🔹 Tự động hết hạn
            public async Task<int> HetHanDatChoAsync()
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HetHanDatCho", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                return await cmd.ExecuteNonQueryAsync();
            }

            // 🔹 Tự động mượn từ đặt chỗ
            public async Task<int> TuDongMuonAsync(string maSach)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TuDongMuonTuDatCho", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaSach", maSach);

                return await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}