using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static QuanLyThueSach.BLL.BanDocBLL;
using QuanLyThueSach.Models;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BanDocController : ControllerBase
    {
        private readonly IBanDocServices _banDocService;

        public BanDocController(IBanDocServices banDocService)
        {
            _banDocService = banDocService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _banDocService.GetBanDocAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var banDoc = await _banDocService.GetBanDocByIdAsync(id);
                if (banDoc == null)
                {
                    return NotFound($"Không tìm thấy bạn đọc với mã: {id}");
                }
                return Ok(banDoc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("search")]
        public async Task<IActionResult> Search(string tuKhoa)
        {
            try
            {
                var banDoc = await _banDocService.SearchBanDocAsync(tuKhoa);
                if (banDoc == null)
                {
                    return NotFound("Không tìm thấy bạn đọc với thông tin đã cung cấp");
                }
                return Ok(banDoc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateBanDoc createBanDoc)
        {
            try
            {
                var result = await _banDocService.CreateAsync(createBanDoc);
                if (result > 0)
                {
                    return Ok("Thêm bạn đọc thành công");
                }
                return BadRequest("Thêm bạn đọc thất bại");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, UpdateBanDoc updateBanDoc)
        {
            try
            {
                var result = await _banDocService.UpdateAsync(id, updateBanDoc);
                if (result > 0)
                {
                    return Ok("Cập nhật bạn đọc thành công");
                }
                return BadRequest("Cập nhật bạn đọc thất bại");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _banDocService.DeleteAsync(id);
                if (result > 0)
                {
                    return Ok("Xóa bạn đọc thành công");
                }
                return BadRequest("Xóa bạn đọc thất bại");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
