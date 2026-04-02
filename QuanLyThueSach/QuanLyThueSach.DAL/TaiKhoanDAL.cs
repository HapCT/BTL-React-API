using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace QuanLyThueSach.DAL
{
   
    public class TaiKhoanDAL
    {
        public interface ITaiKhoanRepository
        {
            Task<List<TaiKhoanModel>> GetAsync();
            Task<int> DangKyAsync(string tenTaiKhoan, string matKhau, string hoTen, string cccd, string soDienThoai, string email);
            Task<TaiKhoanModel> DangNhapAsync(string tenTaiKhoan, string matKhau);
            Task<List<TaiKhoanModel>> SearchAsync(string tuKhoa);
            Task<int> DoiMatKhauAsync(string tenTaiKhoan, string matKhauCu, string matKhauMoi);
            Task<int> XoaTaiKhoanAsync(string tenTaiKhoan);
            Task<int> CreateAsync(CreateTaiKhoan model);
        }
        public class TaiKhoanReponsitory : ITaiKhoanRepository
        {
            private readonly string _con;
            public TaiKhoanReponsitory(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }
            public async Task<List<TaiKhoanModel>> GetAsync()
            {
                var list = new List<TaiKhoanModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_HienThiTaiKhoan", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new TaiKhoanModel
                    {
                        TenTaiKhoan = rd.GetString(0),
                        MatKhau = rd.GetString(1),
                        VaiTro = rd.GetString(2),
                        HoTen = rd.IsDBNull(3) ? null : rd.GetString(3)
                    });
                }

                return list;
            }
            public async Task<int> DangKyAsync(string tenTaiKhoan, string matKhau, string hoTen, string cccd, string soDienThoai, string email)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_DangKy", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TenTaiKhoan", tenTaiKhoan);
                cmd.Parameters.AddWithValue("@MatKhau", matKhau);
                cmd.Parameters.AddWithValue("@HoTen", hoTen);
                cmd.Parameters.AddWithValue("@CCCD", cccd);
                cmd.Parameters.AddWithValue("@SoDienThoai", soDienThoai);
                cmd.Parameters.AddWithValue("@Email", email);
                return await cmd.ExecuteNonQueryAsync();

            }
            public async Task<TaiKhoanModel> DangNhapAsync(string tenTaiKhoan, string matKhau)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_DangNhap", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TenTaiKhoan", tenTaiKhoan);
                cmd.Parameters.AddWithValue("@MatKhau", matKhau);
                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync())
                {
                    return new TaiKhoanModel
                    {
                        TenTaiKhoan = rd.GetString(0),
                        MatKhau = rd.GetString(1),
                        VaiTro = rd.GetString(2)
                    };
                }
                return null;
            }
            public async Task<List<TaiKhoanModel>> SearchAsync(string tentaiKhoan)
            {
                using var connect = new SqlConnection(_con);
                var list = new List<TaiKhoanModel>();
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_TimTaiKhoan", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TenTaiKhoan", tentaiKhoan);
                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync()) {
                        list.Add(new TaiKhoanModel
                        {
                            TenTaiKhoan = rd.GetString(0),
                            MatKhau = rd.GetString(1),
                            VaiTro = rd.GetString(2),
                            HoTen = rd.IsDBNull(3) ? null : rd.GetString(3)
                        });
                        return list;
                }
                return null!;
            }
            public async Task<int> CreateAsync(CreateTaiKhoan model)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TaoTaiKhoan", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TenTaiKhoan", model.TenTaiKhoan);
                cmd.Parameters.AddWithValue("@MatKhau", model.MatKhau);
                cmd.Parameters.AddWithValue("@VaiTro", model.VaiTro);
                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<int> DoiMatKhauAsync(string tenTaiKhoan, string matKhauCu, string matKhauMoi)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_DoiMatKhau", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TenTaiKhoan", tenTaiKhoan);
                cmd.Parameters.AddWithValue("@MatKhauCu", matKhauCu);
                cmd.Parameters.AddWithValue("@MatKhauMoi", matKhauMoi);
                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<int> XoaTaiKhoanAsync(string tenTaiKhoan)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_XoaTaiKhoan", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TenTaiKhoan", tenTaiKhoan);
                return await cmd.ExecuteNonQueryAsync();
            }
        }
        
    }
}
