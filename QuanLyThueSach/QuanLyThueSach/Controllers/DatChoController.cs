using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static QuanLyThueSach.BLL.DatChoBLL;
using QuanLyThueSach.Models;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatChoController : ControllerBase
    {
        private readonly IDatChoServices _datChoService;

        public DatChoController(IDatChoServices datChoService)
        {
            _datChoService = datChoService;
        }

        // 🔹 Lấy tất cả đặt chỗ
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _datChoService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        // 🔹 Đặt chỗ
        [HttpPost]
        public async Task<IActionResult> Create(TaoDatChoRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.MaSach) || string.IsNullOrEmpty(request.MaBanDoc))
                {
                    return BadRequest("Dữ liệu không hợp lệ");
                }

                var result = await _datChoService.DatChoAsync(request);

                if (result.StatusCode == 200)
                {
                    return Ok("Đặt chỗ thành công");
                }
                return BadRequest("Đặt chỗ thất bại");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }

        // 🔹 Huỷ đặt chỗ
        [HttpPut("huy/{maDatCho}")]
        public async Task<IActionResult> HuyDatCho(string maDatCho)
        {
            try
            {
                if (string.IsNullOrEmpty(maDatCho))
                {
                    return BadRequest("Mã đặt chỗ không hợp lệ");
                }

                var result = await _datChoService.HuyDatChoAsync(maDatCho);

                if (result.StatusCode == 200)
                {
                    return Ok("Huỷ đặt chỗ thành công");
                }
                return BadRequest(result.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }

        // 🔹 Tự động hết hạn
        [HttpPut("hethan")]
        public async Task<IActionResult> HetHan()
        {
            try
            {
                var result = await _datChoService.HetHanDatChoAsync();

                if (result.Data > 0)
                {
                    return Ok("Cập nhật hết hạn thành công");
                }

                return Ok("Không có dữ liệu hết hạn");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }

        // 🔹 Tự động mượn từ đặt chỗ
        [HttpPost("tudong-muon")]
        public async Task<IActionResult> TuDongMuon(string maSach)
        {
            try
            {
                if (string.IsNullOrEmpty(maSach))
                {
                    return BadRequest("Mã sách không hợp lệ");
                }

                var result = await _datChoService.TuDongMuonAsync(maSach);

                if (result.Data > 0)
                {
                    return Ok("Tự động mượn thành công");
                }

                return Ok("Không có dữ liệu để xử lý");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }
    }
}