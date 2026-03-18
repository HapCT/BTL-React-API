using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.SachBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : ControllerBase
    {
        private readonly ISachServices _SachService;

        public SachController(ISachServices SachService)
        {
            _SachService = SachService;
        }

        // Lấy tất cả sách
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _SachService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Tìm sách theo mã
        [HttpGet("{masach}")]
        public async Task<IActionResult> GetSachId(string masach)
        {
            try
            {
                var response = await _SachService.TimSachIDAsync(masach);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Thêm sách
        [HttpPost]
        public async Task<IActionResult> ThemSach(ThemSach sach)
        {
            try
            {
                var response = await _SachService.ThemSachAsync(sach);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Sửa sách
        [HttpPut("{masach}")]
        public async Task<IActionResult> SuaSach(string masach, SuaSach sach)
        {
            try
            {
                var response = await _SachService.SuaSachAsync(masach, sach);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Xóa sách
        [HttpDelete("{masach}")]
        public async Task<IActionResult> XoaSach(string masach)
        {
            try
            {
                var response = await _SachService.XoaSachAsync(masach);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("search/{tukhoa}")]
        public async Task<IActionResult> TimSach(string tukhoa)
        {
            try
            {
                var response = await _SachService.TimSachAsync(tukhoa);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}