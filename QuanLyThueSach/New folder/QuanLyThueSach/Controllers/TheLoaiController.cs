using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;

using static QuanLyThueSach.BLL.TheLoaiBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheLoaiController : ControllerBase
    {
        private readonly ITheLoaiServices _TheLoaiService;

        public TheLoaiController(ITheLoaiServices TheLoaiService)
        {
            _TheLoaiService = TheLoaiService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _TheLoaiService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> ThemTL([FromBody] ThemTheLoai theLoai)
        {
            try
            {
                var response = await _TheLoaiService.ThemTLAsync(theLoai);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPut("{maTheLoai}")]
        public async Task<IActionResult> SuaTL(string maTheLoai, [FromBody] SuaTheLoai theLoai)
        {
            try
            {
                var response = await _TheLoaiService.SuaTLAsync(maTheLoai, theLoai);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaTL(string id)
        {
            try
            {
                var response = await _TheLoaiService.XoaTaiKhoanAsync(id);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("search")]
        public async Task<IActionResult> TimTL(string tukhoa)
        {
            try
            {
                var response = await _TheLoaiService.SearchAsync(tukhoa);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> TimTLid(string id)
        {
            try
            {
                var response = await _TheLoaiService.TimTLidAsync(id);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
