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
        [HttpPost]
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
        [HttpPut("{TenTaiKhoan}")]
        public async Task<IActionResult> DoiMatKhau(DoiMatKhauModel doiMatKhau)
        {
            try
            {
                var response = await _TaiKhoanService.DoiMatKhauAsync(doiMatKhau.TenTaiKhoan, doiMatKhau.MatKhauCu, doiMatKhau.MatKhauMoi);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("{TenTaiKhoan}")]
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
    }
}
