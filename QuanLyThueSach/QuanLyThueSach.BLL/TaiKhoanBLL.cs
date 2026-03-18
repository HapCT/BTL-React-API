using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static QuanLyThueSach.DAL.TaiKhoanDAL;
namespace QuanLyThueSach.BLL
{
    public class TaiKhoanBLL
    {
        public interface ITaiKhoanServices
        {
            Task<Respon<List<TaiKhoanModel>>> GetAsync();
            Task<Respon<int>> DangKyAsync(string tenTaiKhoan, string matKhau, string hoTen, string cccd, string soDienThoai, string email);
            Task<Respon<TaiKhoanModel>> DangNhapAsync(string tenTaiKhoan, string matKhau);
            Task<Respon<List<TaiKhoanModel>>> SearchAsync(string tuKhoa);
            Task<Respon<int>> DoiMatKhauAsync(string tenTaiKhoan, string matKhauCu, string matKhauMoi);
            Task<Respon<int>> XoaTaiKhoanAsync(string tenTaiKhoan);
        }
        public class TaiKhoanService : ITaiKhoanServices
        {
            private readonly ITaiKhoanRepository _repository;

            public TaiKhoanService(ITaiKhoanRepository repository)
            {
                _repository = repository;
            }

            public async Task<Respon<List<TaiKhoanModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();
                    return new Respon<List<TaiKhoanModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<TaiKhoanModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> DangKyAsync(string tenTaiKhoan, string matKhau, string hoTen, string cccd, string soDienThoai, string email)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(tenTaiKhoan) || string.IsNullOrWhiteSpace(matKhau))
                    {
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Tên tài khoản hoặc mật khẩu không được để trống",
                            Data = 0
                        };
                    }

                    var result = await _repository.DangKyAsync(tenTaiKhoan, matKhau, hoTen, cccd, soDienThoai, email);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Đăng ký thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = 0
                    };
                }
            }

            public async Task<Respon<TaiKhoanModel>> DangNhapAsync(string tenTaiKhoan, string matKhau)
            {
                try
                {
                    var list = await _repository.DangNhapAsync(tenTaiKhoan, matKhau);
                    if (list == null)
                    {
                        return new Respon<TaiKhoanModel>
                        {
                            StatusCode = 401,
                            Message = "Sai tài khoản hoặc mật khẩu",
                            Data = null
                        };
                    }
                    return new Respon<TaiKhoanModel>
                    {
                        StatusCode = 200,
                        Message = "Đăng nhập thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<TaiKhoanModel>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<List<TaiKhoanModel>>> SearchAsync(string tuKhoa)
            {
                try
                {
                    var list = await _repository.SearchAsync(tuKhoa);
                    if(tuKhoa == null || list.Count == 0)
                    {
                        return new Respon<List<TaiKhoanModel>>
                        {
                            StatusCode = 200,
                            Message = "Không có dữ liệu bạn cần tìm!",
                            Data = list
                        };
                    }    
                    return new Respon<List<TaiKhoanModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy dữ liệu thành công",
                        Data = list
                    };
                    
                }
                catch (Exception ex)
                {
                    return new Respon<List<TaiKhoanModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> DoiMatKhauAsync(string tenTaiKhoan, string matKhauCu, string matKhauMoi)
            {
                try
                {
                    var list = await _repository.DoiMatKhauAsync(tenTaiKhoan, matKhauCu, matKhauMoi);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Đổi mật khẩu thành công thành công",
                        Data = list
                    };

                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> XoaTaiKhoanAsync(string tenTaiKhoan)
            {
                try
                {
                    var list = await _repository.XoaTaiKhoanAsync(tenTaiKhoan);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xoá tài khoản thành công thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
        }
    }
}
