using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ocelot.Values;
using QuanLyThueSach.Models;
using System.Data;
using static QuanLyThueSach.BLL.ThanhToanBLL;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly IThanhToanServices _thanhToanService;

        public ThanhToanController(IThanhToanServices thanhToanService)
        {
            _thanhToanService = thanhToanService;
        }

        // 🔹 Lấy danh sách thanh toán
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _thanhToanService.GetAsync();
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("thanh-toan")]
        public async Task<IActionResult> ThanhToan([FromBody]ThanhToanRequest request)
        {
            var result = await _thanhToanService.ThanhToanAsync(request);
            return Ok(result);
        }

        // 🔹 Lấy hoá đơn theo mã
        [HttpGet("{maThanhToan}")]
        public async Task<IActionResult> GetHoaDon(string maThanhToan)
        {
            try
            {
                var response = await _thanhToanService.GetHoaDonAsync(maThanhToan);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("preview/{maPhieuMuon}")]
        public async Task<IActionResult> Preview(string maPhieuMuon)
        {
            try
            {
                using var con = new SqlConnection(
                    HttpContext.RequestServices
                    .GetService<IConfiguration>()
                    .GetConnectionString("DefaultConnection"));

                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_PreviewThanhToan", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                using var rd = await cmd.ExecuteReaderAsync();

                if (await rd.ReadAsync())
                {
                    return Ok(new
                    {
                        tienThue = Convert.ToDecimal(rd["TienThue"]),
                        tienPhat = Convert.ToDecimal(rd["TienPhat"]),
                        tongTien = Convert.ToDecimal(rd["TongTien"])
                    });
                }

                return NotFound("Không tìm thấy dữ liệu");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        // 🔹 Huỷ thanh toán
        [HttpPut("huy/{maThanhToan}")]
        public async Task<IActionResult> HuyThanhToan(string maThanhToan)
        {
            try
            {
                var response = await _thanhToanService.HuyThanhToanAsync(maThanhToan);
                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}