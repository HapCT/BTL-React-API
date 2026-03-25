using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.BLL;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.PhatBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhatController : ControllerBase
    {
        private readonly IPhatServices _phatService;

        public PhatController(IPhatServices phatService)
        {
            _phatService = phatService;
        }

        // 🔹 Lấy danh sách phạt
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _phatService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 Tìm kiếm phạt
        [HttpGet("search")]
        public async Task<IActionResult> Search(string? keyword, string? trangThai)
        {
            try
            {
                var response = await _phatService.SearchAsync(keyword, trangThai);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 Tạo phạt
        [HttpPost]
        public async Task<IActionResult> TaoPhat([FromBody] TaoPhatRequest request)
        {
            try
            {
                var response = await _phatService.TaoPhatAsync(request);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 Thanh toán phạt
        [HttpPut("thanh-toan/{maPhat}")]
        public async Task<IActionResult> ThanhToan(string maPhat)
        {
            try
            {
                var response = await _phatService.ThanhToanPhatAsync(maPhat);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 Huỷ phạt
        [HttpPut("huy/{maPhat}")]
        public async Task<IActionResult> Huy(string maPhat)
        {
            try
            {
                var response = await _phatService.HuyPhatAsync(maPhat);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}