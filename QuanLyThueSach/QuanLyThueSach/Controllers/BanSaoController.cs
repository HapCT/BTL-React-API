using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.BanSaoBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BanSaoController : ControllerBase
    {
        private readonly IBanSaoServices _banSaoService;

        public BanSaoController(IBanSaoServices banSaoService)
        {
            _banSaoService = banSaoService;
        }

        // Hiển thị danh sách bản sao
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _banSaoService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Tìm bản sao theo ID
        [HttpGet("{maBanSao}")]
        public async Task<IActionResult> GetBanSaoID(string maBanSao)
        {
            try
            {
                var response = await _banSaoService.TimBanSaoIDAsync(maBanSao);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Tìm kiếm
        [HttpGet("search/{tuKhoa}")]
        public async Task<IActionResult> Search(string tuKhoa)
        {
            try
            {
                var response = await _banSaoService.SearchAsync(tuKhoa);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Thêm bản sao
        [HttpPost]
        public async Task<IActionResult> ThemBanSao(ThemBanSao banSao)
        {
            try
            {
                var response = await _banSaoService.ThemBanSaoAsync(banSao);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Sửa bản sao
        [HttpPut("{maBanSao}")]
        public async Task<IActionResult> SuaBanSao(string maBanSao, SuaBanSao banSao)
        {
            try
            {
                var response = await _banSaoService.SuaBanSaoAsync(maBanSao, banSao);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Xóa bản sao
        [HttpDelete("{maBanSao}")]
        public async Task<IActionResult> XoaBanSao(string maBanSao)
        {
            try
            {
                var response = await _banSaoService.XoaBanSaoAsync(maBanSao);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}