using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyThueSach.Models;
using static QuanLyThueSach.BLL.PhieuMuonBLL;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuMuonController : ControllerBase
    {
        private readonly IPhieuMuonServices _phieuMuonService;

        public PhieuMuonController(IPhieuMuonServices phieuMuonService)
        {
            _phieuMuonService = phieuMuonService;
        }

        // 🔹 1. Lấy tất cả phiếu mượn
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _phieuMuonService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 2. Lấy theo bạn đọc
        [HttpGet("{maBanDoc}")]
        public async Task<IActionResult> GetByBanDoc(string maBanDoc)
        {
            try
            {
                var response = await _phieuMuonService.GetByBanDocAsync(maBanDoc);

                if (response.Data == null || response.Data.Count == 0)
                {
                    return NotFound("Không có phiếu mượn");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 3. Đăng ký mượn
        [HttpPost("dang-ky")]
        public async Task<IActionResult> DangKyMuon([FromBody] MuonOline model)
        {
            try
            {
                var response = await _phieuMuonService.DangKyMuonAsync(model);

                if (response.StatusCode == 200)
                {
                    return Ok(response.Message);
                }

                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 4. Duyệt mượn
        [HttpPut("duyet/{maPhieuMuon}")]
        public async Task<IActionResult> DuyetMuon(string maPhieuMuon)
        {
            try
            {
                var response = await _phieuMuonService.DuyetMuonAsync(maPhieuMuon);

                if (response.StatusCode == 200)
                {
                    return Ok(response.Message);
                }

                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 5. Trả sách
        [HttpPut("tra/{maPhieuMuon}")]
        public async Task<IActionResult> TraSach(string maPhieuMuon)
        {
            try
            {
                var response = await _phieuMuonService.TraSachAsync(maPhieuMuon);

                if (response.StatusCode == 200)
                {
                    return Ok(response.Message);
                }

                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 6. Gia hạn
        [HttpPut("gia-han/{maPhieuMuon}")]
        public async Task<IActionResult> GiaHan(string maPhieuMuon, [FromBody] int soNgayThem)
        {
            try
            {
                var response = await _phieuMuonService.GiaHanAsync(maPhieuMuon, soNgayThem);

                if (response.StatusCode == 200)
                {
                    return Ok(response.Message);
                }

                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 🔹 7. Hủy phiếu
        [HttpPut("huy/{maPhieuMuon}")]
        public async Task<IActionResult> Huy(string maPhieuMuon)
        {
            try
            {
                var response = await _phieuMuonService.HuyAsync(maPhieuMuon);

                if (response.StatusCode == 200)
                {
                    return Ok(response.Message);
                }

                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        // 🔹 8. Xoá phiếu mượn
        [HttpDelete("{maPhieuMuon}")]
        public async Task<IActionResult> XoaPhieuMuon(string maPhieuMuon)
        {
            try
            {
                var response = await _phieuMuonService.XoaPhieuMuonAsync(maPhieuMuon);

                if (response.StatusCode == 200)
                {
                    return Ok(response.Message);
                }

                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}