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
            Task<List<DatChoModel>> GetAsync();
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
            public async Task<List<DatChoModel>> GetAsync()
            {
                var list = new List<DatChoModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM DatCho", connect);

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new DatChoModel
                    {
                        MaDatCho = rd["MaDatCho"].ToString(),
                        MaSach = rd["MaSach"].ToString(),
                        MaBanDoc = rd["MaBanDoc"].ToString(),
                        ThoiGianGiuCho = Convert.ToDateTime(rd["ThoiGianGiuCho"]),
                        TrangThai = rd["TrangThai"].ToString(),
                        ThuTu = Convert.ToInt32(rd["ThuTu"])
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