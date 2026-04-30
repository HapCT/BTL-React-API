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
        private readonly ISachServices _sach;

        public SachController(ISachServices sach) => _sach = sach;

        // GET /api/Sach
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var res = await _sach.GetAsync();
            return StatusCode(res.StatusCode, res);
        }

        // GET /api/Sach/{masach}
        [HttpGet("{masach}")]
        public async Task<IActionResult> GetById(string masach)
        {
            var res = await _sach.TimSachIDAsync(masach);
            return StatusCode(res.StatusCode, res);
        }

        // GET /api/Sach/search/{tukhoa}
        [HttpGet("search/{tukhoa}")]
        public async Task<IActionResult> TimSach(string tukhoa)
        {
            var res = await _sach.TimSachAsync(tukhoa);
            return StatusCode(res.StatusCode, res);
        }

        // GET /api/Sach/pho-bien
        [HttpGet("pho-bien")]
        public async Task<IActionResult> PhoBien()
        {
            var res = await _sach.GetSachPhoBienAsync();
            return StatusCode(res.StatusCode, res);
        }

        // POST /api/Sach  — multipart/form-data
        [HttpPost]
        public async Task<IActionResult> Them([FromForm] ThemSachRequest model)
        {
            try
            {
                string? hinhAnh = null;

                if (model.HinhAnh != null && model.HinhAnh.Length > 0)
                    hinhAnh = await LuuAnh(model.HinhAnh);

                var res = await _sach.ThemSachAsync(new ThemSach
                {
                    TieuDe           = model.TieuDe,
                    TacGia           = model.TacGia,
                    NamXB            = model.NamXB,
                    NgonNgu          = model.NgonNgu,
                    SoLuongSach      = model.SoLuongSach,
                    HinhAnh          = hinhAnh,
                    DanhSachTheLoai  = model.DanhSachTheLoai ?? new()
                });

                return StatusCode(res.StatusCode, res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        // PUT /api/Sach/{masach}  — multipart/form-data
        [HttpPut("{masach}")]
        public async Task<IActionResult> Sua(string masach, [FromForm] SuaSachRequest model)
        {
            try
            {
                string? hinhAnh = null;

                if (model.HinhAnh != null && model.HinhAnh.Length > 0)
                {
                    // Xóa ảnh cũ nếu có
                    if (!string.IsNullOrEmpty(model.HinhAnhCu))
                        XoaAnh(model.HinhAnhCu);

                    hinhAnh = await LuuAnh(model.HinhAnh);
                }
                else
                {
                    // Giữ ảnh cũ
                    hinhAnh = model.HinhAnhCu;
                }

                var res = await _sach.SuaSachAsync(masach, new SuaSach
                {
                    TieuDe          = model.TieuDe,
                    TacGia          = model.TacGia,
                    NamXB           = model.NamXB,
                    NgonNgu         = model.NgonNgu,
                    SoLuongSach     = model.SoLuongSach,
                    HinhAnh         = hinhAnh,
                    HinhAnhCu       = model.HinhAnhCu,
                    DanhSachTheLoai = model.DanhSachTheLoai ?? new()
                });

                return StatusCode(res.StatusCode, res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        // DELETE /api/Sach/{masach}
        [HttpDelete("{masach}")]
        public async Task<IActionResult> Xoa(string masach)
        {
            var res = await _sach.XoaSachAsync(masach);
            return StatusCode(res.StatusCode, res);
        }

        // ── Helper: lưu file ảnh vào wwwroot/images ──────────────────────────
        private async Task<string> LuuAnh(IFormFile file)
        {
            // Chỉ cho phép ảnh
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                throw new Exception("Định dạng ảnh không hợp lệ. Chỉ chấp nhận jpg, png, gif, webp.");

            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid().ToString() + ext;
            var filePath = Path.Combine(folder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return "/images/" + fileName;   // URL trả về frontend
        }

        private void XoaAnh(string url)
        {
            try
            {
                if (string.IsNullOrEmpty(url)) return;
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot",
                    url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }
            catch { /* không ném lỗi nếu xóa ảnh cũ thất bại */ }
        }
    }
}
