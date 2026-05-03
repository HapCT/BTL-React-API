using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyThueSach.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKeController : ControllerBase
    {
        private readonly IConfiguration _config;
        public ThongKeController(IConfiguration config) { _config = config; }

        private SqlConnection GetCon() =>
            new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        // GET /api/ThongKe/tong-quan
        [HttpGet("tong-quan")]
        public async Task<IActionResult> TongQuan()
        {
            try
            {
                using var con = GetCon();
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_ThongKeTongQuan", con)
                { CommandType = CommandType.StoredProcedure };
                using var rd = await cmd.ExecuteReaderAsync();

                var result = new Dictionary<string, object>();

                if (await rd.ReadAsync()) result["tongSach"] = rd[0];
                if (await rd.NextResultAsync() && await rd.ReadAsync()) result["tongBanDoc"] = rd[0];
                if (await rd.NextResultAsync() && await rd.ReadAsync()) result["dangMuon"] = rd[0];
                if (await rd.NextResultAsync() && await rd.ReadAsync()) result["quaHan"] = rd[0];
                if (await rd.NextResultAsync() && await rd.ReadAsync()) result["doanhThuThang"] = rd[0];
                if (await rd.NextResultAsync() && await rd.ReadAsync()) result["phatChuaThu"] = rd[0];

                return Ok(new { data = result });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // GET /api/ThongKe/doanh-thu
        [HttpGet("doanh-thu")]
        public async Task<IActionResult> DoanhThu()
        {
            try
            {
                using var con = GetCon();
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_ThongKeDoanhThuTheoThang", con)
                { CommandType = CommandType.StoredProcedure };
                using var rd = await cmd.ExecuteReaderAsync();

                var list = new List<object>();
                while (await rd.ReadAsync())
                    list.Add(new
                    {
                        nam = Convert.ToInt32(rd["Nam"]),
                        thang = Convert.ToInt32(rd["Thang"]),
                        doanhThu = Convert.ToDecimal(rd["DoanhThu"]),
                        soGiaoDich = Convert.ToInt32(rd["SoGiaoDich"])
                    });

                return Ok(new { data = list });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // GET /api/ThongKe/sach-muon-nhieu
        [HttpGet("sach-muon-nhieu")]
        public async Task<IActionResult> SachMuonNhieu()
        {
            try
            {
                using var con = GetCon();
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_ThongKeSachMuonNhieu", con)
                { CommandType = CommandType.StoredProcedure };
                using var rd = await cmd.ExecuteReaderAsync();

                var list = new List<object>();
                while (await rd.ReadAsync())
                    list.Add(new
                    {
                        maSach = rd["MaSach"].ToString(),
                        tieuDe = rd["TieuDe"].ToString(),
                        tacGia = rd["TacGia"].ToString(),
                        hinhAnh = rd["HinhAnh"] == DBNull.Value ? null : rd["HinhAnh"].ToString(),
                        soLanMuon = Convert.ToInt32(rd["SoLanMuon"])
                    });

                return Ok(new { data = list });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // GET /api/ThongKe/ban-doc-tich-cuc
        [HttpGet("ban-doc-tich-cuc")]
        public async Task<IActionResult> BanDocTichCuc()
        {
            try
            {
                using var con = GetCon();
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_ThongKeBanDocTichCuc", con)
                { CommandType = CommandType.StoredProcedure };
                using var rd = await cmd.ExecuteReaderAsync();

                var list = new List<object>();
                while (await rd.ReadAsync())
                    list.Add(new
                    {
                        maBanDoc = rd["MaBanDoc"].ToString(),
                        hoTen = rd["HoTen"].ToString(),
                        soDienThoai = rd["SoDienThoai"].ToString(),
                        duNo = Convert.ToDecimal(rd["DuNo"]),
                        soLanMuon = Convert.ToInt32(rd["SoLanMuon"])
                    });

                return Ok(new { data = list });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // GET /api/ThongKe/the-loai
        [HttpGet("the-loai")]
        public async Task<IActionResult> TheoTheLoai()
        {
            try
            {
                using var con = GetCon();
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_ThongKeTheoTheLoai", con)
                { CommandType = CommandType.StoredProcedure };
                using var rd = await cmd.ExecuteReaderAsync();

                var list = new List<object>();
                while (await rd.ReadAsync())
                    list.Add(new
                    {
                        tenTheLoai = rd["TenTheLoai"].ToString(),
                        soSach = Convert.ToInt32(rd["SoSach"]),
                        soLanMuon = Convert.ToInt32(rd["SoLanMuon"])
                    });

                return Ok(new { data = list });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }
    }
}