using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static QuanLyThueSach.DAL.TaiKhoanDAL;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BCrypt.Net;

namespace QuanLyThueSach.BLL
{
    public class TaiKhoanBLL
    {
        public interface ITaiKhoanServices
        {
            Task<Respon<List<TaiKhoanModel>>> GetAsync();
            Task<Respon<int>> DangKyAsync(string tenTaiKhoan, string matKhau, string hoTen, string cccd, string soDienThoai, string email);
            Task<Respon<object>> DangNhapAsync(string tenTaiKhoan, string matKhau);
            Task<Respon<List<TaiKhoanModel>>> SearchAsync(string tuKhoa);
            Task<Respon<int>> DoiMatKhauAsync(string tenTaiKhoan, string matKhauCu, string matKhauMoi);
            Task<Respon<int>> XoaTaiKhoanAsync(string tenTaiKhoan);
            Task<Respon<int>> CreateAsync(CreateTaiKhoan model);
        }

        public class TaiKhoanService : ITaiKhoanServices
        {
            private readonly ITaiKhoanRepository _repository;
            private readonly IConfiguration _config;

            public TaiKhoanService(ITaiKhoanRepository repository, IConfiguration config)
            {
                _repository = repository;
                _config = config;
            }

            private string GenerateJwtToken(TaiKhoanModel user)
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expireHours = int.Parse(_config["Jwt:ExpireHours"] ?? "8");

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.TenTaiKhoan),
                    new Claim(ClaimTypes.Role, user.VaiTro),
                    new Claim("hoTen", user.HoTen ?? ""),
                };

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(expireHours),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
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

                    // Hash mật khẩu trước khi lưu
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(matKhau);

                    var result = await _repository.DangKyAsync(tenTaiKhoan, hashedPassword, hoTen, cccd, soDienThoai, email);

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

            public async Task<Respon<object>> DangNhapAsync(string tenTaiKhoan, string matKhau)
            {
                try
                {
                    var user = await _repository.DangNhapAsync(tenTaiKhoan, matKhau);

                    if (user == null)
                    {
                        return new Respon<object>
                        {
                            StatusCode = 401,
                            Message = "Sai tài khoản hoặc mật khẩu",
                            Data = null
                        };
                    }

                    // Verify BCrypt password
                    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(matKhau, user.MatKhau);
                    if (!isPasswordValid)
                    {
                        return new Respon<object>
                        {
                            StatusCode = 401,
                            Message = "Sai tài khoản hoặc mật khẩu",
                            Data = null
                        };
                    }

                    var token = GenerateJwtToken(user);

                    return new Respon<object>
                    {
                        StatusCode = 200,
                        Message = "Đăng nhập thành công",
                        Data = new
                        {
                            tenTaiKhoan = user.TenTaiKhoan,
                            vaiTro = user.VaiTro,
                            hoTen = user.HoTen,
                            maBanDoc = user.MaBanDoc,  // ← THÊM MỚI
                            token = token
                        }
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<object>
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
                    if (tuKhoa == null || list.Count == 0)
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
                    // Lấy user để verify mật khẩu cũ
                    var user = await _repository.DangNhapAsync(tenTaiKhoan, matKhauCu);
                    if (user == null || !BCrypt.Net.BCrypt.Verify(matKhauCu, user.MatKhau))
                    {
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Mật khẩu cũ không đúng",
                            Data = 0
                        };
                    }

                    var hashedNew = BCrypt.Net.BCrypt.HashPassword(matKhauMoi);
                    var result = await _repository.DoiMatKhauAsync(tenTaiKhoan, matKhauCu, hashedNew);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Đổi mật khẩu thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = 0
                    };
                }
            }

            public async Task<Respon<int>> XoaTaiKhoanAsync(string tenTaiKhoan)
            {
                try
                {
                    var result = await _repository.XoaTaiKhoanAsync(tenTaiKhoan);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xoá tài khoản thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = 0
                    };
                }
            }

            public async Task<Respon<int>> CreateAsync(CreateTaiKhoan model)
            {
                try
                {
                    // Hash mật khẩu khi admin tạo tài khoản thủ công
                    model.MatKhau = BCrypt.Net.BCrypt.HashPassword(model.MatKhau);
                    var result = await _repository.CreateAsync(model);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Tạo tài khoản thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = 0
                    };
                }
            }
        }
    }
}