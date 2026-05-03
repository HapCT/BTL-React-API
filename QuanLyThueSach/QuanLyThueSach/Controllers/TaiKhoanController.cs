using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.BanDocBLL;
using static QuanLyThueSach.BLL.TaiKhoanBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly ITaiKhoanServices _TaiKhoanService;

        public TaiKhoanController(ITaiKhoanServices TaiKhoanService)
        {
            _TaiKhoanService = TaiKhoanService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _TaiKhoanService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{tentaikhoan}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTaiKhoanId(string tentaikhoan)
        {
            try
            {
                var response = await _TaiKhoanService.SearchAsync(tentaikhoan);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("dangky-thuthu")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateTaiKhoan model)
        {
            try
            {
                var response = await _TaiKhoanService.CreateAsync(model);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Đăng ký public — không cần token
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> DangKy(DangKyModel dangky)
        {
            try
            {
                var response = await _TaiKhoanService.DangKyAsync(dangky.TenTaiKhoan, dangky.MatKhau, dangky.HoTen, dangky.CCCD, dangky.SoDienThoai, dangky.Email);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("doi-mat-khau/{TenTaiKhoan}")]
        [Authorize]
        public async Task<IActionResult> DoiMatKhau(string TenTaiKhoan, DoiMatKhauModel model)
        {
            try
            {
                var response = await _TaiKhoanService.DoiMatKhauAsync(
                    TenTaiKhoan,
                    model.MatKhauCu,
                    model.MatKhauMoi
                );
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{TenTaiKhoan}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> XoaTaiKhoan(string TenTaiKhoan)
        {
            try
            {
                var response = await _TaiKhoanService.XoaTaiKhoanAsync(TenTaiKhoan);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Đăng nhập public — không cần token
        [HttpPost("dang-nhap")]
        [AllowAnonymous]
        public async Task<IActionResult> DangNhapAsync(DangNhapModel model)
        {
            var response = await _TaiKhoanService.DangNhapAsync(model.TenTaiKhoan, model.MatKhau);
            return StatusCode(response.StatusCode, response);
        }
    }
}