using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static QuanLyThueSach.BLL.ThanhToanBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly IThanhToanServices _thanhToanService;

        public ThanhToanController(IThanhToanServices thanhToanService)
        {
            _thanhToanService = thanhToanService;
        }

        // 🔹 Lấy danh sách thanh toán
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _thanhToanService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 Lấy hoá đơn theo mã
        [HttpGet("{maThanhToan}")]
        public async Task<IActionResult> GetHoaDon(string maThanhToan)
        {
            try
            {
                var response = await _thanhToanService.GetHoaDonAsync(maThanhToan);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 Huỷ thanh toán
        [HttpPut("huy/{maThanhToan}")]
        public async Task<IActionResult> HuyThanhToan(string maThanhToan)
        {
            try
            {
                var response = await _thanhToanService.HuyThanhToanAsync(maThanhToan);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}