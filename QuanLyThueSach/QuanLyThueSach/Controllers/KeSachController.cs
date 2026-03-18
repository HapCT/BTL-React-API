using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.KeSachBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KeSachController : ControllerBase
    {
        private readonly IKeSachServices _keSachService;

        public KeSachController(IKeSachServices keSachService)
        {
            _keSachService = keSachService;
        }

        // Lấy tất cả kệ sách
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _keSachService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Tìm kệ theo ID
        [HttpGet("{maKe}")]
        public async Task<IActionResult> GetKeById(string maKe)
        {
            try
            {
                var response = await _keSachService.TimKeIdAsync(maKe);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Tìm kiếm kệ
        [HttpGet("search/{tuKhoa}")]
        public async Task<IActionResult> Search(string tuKhoa)
        {
            try
            {
                var response = await _keSachService.SearchAsync(tuKhoa);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Thêm kệ sách
        [HttpPost]
        public async Task<IActionResult> ThemKe(ThemKeSach keSach)
        {
            try
            {
                var response = await _keSachService.ThemKeAsync(keSach);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Sửa kệ sách
        [HttpPut("{maKe}")]
        public async Task<IActionResult> SuaKe(string maKe, SuaKeSach keSach)
        {
            try
            {
                var response = await _keSachService.SuaKeAsync(maKe, keSach);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Xóa kệ sách
        [HttpDelete("{maKe}")]
        public async Task<IActionResult> XoaKe(string maKe)
        {
            try
            {
                var response = await _keSachService.XoaKeAsync(maKe);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}