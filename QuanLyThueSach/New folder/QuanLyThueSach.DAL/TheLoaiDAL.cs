using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static QuanLyThueSach.DAL.TaiKhoanDAL;

namespace QuanLyThueSach.DAL
{
    public class TheLoaiDAL
    {
        public interface ITheLoaiRepository
        {
            Task<List<TheLoaiModel>> GetAsync();
            Task<int> ThemTLAsync(ThemTheLoai themTheLoai);
            Task<List<TheLoaiModel>> TimTLidAsync(string MaTheLoai);
            Task<List<TheLoaiModel>> SearchAsync(string tuKhoa);
            Task<int> SuaTLAsync(string maTheLoai, SuaTheLoai suaTheLoai);
            Task<int> XoaTaiKhoanAsync(string MaTheLoai);
        }
        public class TheLoaiReponsitory : ITheLoaiRepository
        {
            private readonly string _con;
            public TheLoaiReponsitory(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }
            public async Task<List<TheLoaiModel>> GetAsync()
            {
                var list = new List<TheLoaiModel>();
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_HienThiTheLoai", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                using var rd = await cmd.ExecuteReaderAsync();
                while (rd.Read())
                {
                    list.Add(new TheLoaiModel
                    {
                        MaTheLoai = rd.GetString(0),
                        TenTheLoai = rd.IsDBNull(1) ? null : rd.GetString(1),
                        MoTa = rd.IsDBNull(2) ? null : rd.GetString(2)

                    });
                }
                return list;
            }
            public async Task<int> ThemTLAsync(ThemTheLoai themTheLoai)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_ThemTheLoai", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TenTheLoai", themTheLoai.TenTheLoai);
                cmd.Parameters.AddWithValue("@MoTa", themTheLoai.MoTa);
                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<List<TheLoaiModel>> TimTLidAsync(string MaTheLoai)
            {
                var list = new List<TheLoaiModel>();
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_TimTheLoaiTheoID", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaTheLoai", MaTheLoai);
                using var rd = await cmd.ExecuteReaderAsync();
                while (rd.Read())
                {
                    list.Add(new TheLoaiModel
                    {
                        MaTheLoai = rd.GetString(0),
                        TenTheLoai = rd.IsDBNull(1) ? null : rd.GetString(1),
                        MoTa = rd.IsDBNull(2) ? null : rd.GetString(2)
                    });
                }
                return list;
            }
            public async Task<List<TheLoaiModel>> SearchAsync(string tuKhoa)
            {
                var list = new List<TheLoaiModel>();
                using var connect = new SqlConnection(_con);    
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_TimTheLoai", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TuKhoa", tuKhoa);
                using var rd = await cmd.ExecuteReaderAsync();
                while (rd.Read())
                {
                    list.Add(new TheLoaiModel
                    {
                        MaTheLoai = rd.GetString(0),
                        TenTheLoai = rd.IsDBNull(1) ? null : rd.GetString(1),
                        MoTa = rd.IsDBNull(2) ? null : rd.GetString(2)
                    });
                }
                return list;
            }
            public async Task<int> SuaTLAsync(string maTheLoai, SuaTheLoai suaTheLoai)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_SuaTheLoai", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MaTheLoai", maTheLoai);
                cmd.Parameters.AddWithValue("@TenTheLoai", suaTheLoai.TenTheLoai);
                cmd.Parameters.AddWithValue("@MoTa", suaTheLoai.MoTa);

                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<int> XoaTaiKhoanAsync(string MaTheLoai)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_XoaTheLoai", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaTheLoai", MaTheLoai);
                return await cmd.ExecuteNonQueryAsync();
            }
            
        }
    }
}
