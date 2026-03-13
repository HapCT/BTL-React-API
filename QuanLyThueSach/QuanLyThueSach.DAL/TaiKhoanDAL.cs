using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuanLyThueSach.Models;
using Microsoft.Extensions.Configuration;
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
        }
        public class TaiKhoanReponsitory : ITaiKhoanRepository
        {
            private readonly string _con;
            public TaiKhoanReponsitory(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }

        }
        
    }
}
