using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.HoaDonNhapBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonNhapController : ControllerBase
    {
        private readonly IHoaDonNhapServices _service;

        public HoaDonNhapController(IHoaDonNhapServices service)
        {
            _service = service;
        }

        // GET /api/HoaDonNhap
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var res = await _service.GetAllAsync();
            return StatusCode(res.StatusCode, res);
        }

        // GET /api/HoaDonNhap/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var res = await _service.GetByIdAsync(id);
            return StatusCode(res.StatusCode, res);
        }

        // POST /api/HoaDonNhap
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HoaDonNhapRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await _service.CreateAsync(request);
            return StatusCode(res.StatusCode, res);
        }

        // PUT /api/HoaDonNhap/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] HoaDonNhapRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await _service.UpdateAsync(id, request);
            return StatusCode(res.StatusCode, res);
        }

        // DELETE /api/HoaDonNhap/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var res = await _service.DeleteAsync(id);
            return StatusCode(res.StatusCode, res);
        }
    }
}
