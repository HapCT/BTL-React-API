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
        public async Task<IActionResult> ThemSach([FromForm] ThemSachRequest model)
        {
            try
            {
                string fileName = null;

                if (model.HinhAnh != null)
                {
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.HinhAnh.FileName);

                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

                    using var stream = new FileStream(path, FileMode.Create);
                    await model.HinhAnh.CopyToAsync(stream);
                }

                string url = "/images/" + fileName;

                var response = await _SachService.ThemSachAsync(new ThemSach
                {
                    MaTheLoai = model.MaTheLoai,
                    TieuDe = model.TieuDe,
                    TacGia = model.TacGia,
                    NamXB = model.NamXB,
                    NgonNgu = model.NgonNgu,
                    SoLuongSach = model.SoLuongSach,
                    HinhAnh = url
                });

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