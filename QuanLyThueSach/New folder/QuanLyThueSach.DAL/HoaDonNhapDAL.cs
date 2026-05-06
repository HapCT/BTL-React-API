using Microsoft.Extensions.Configuration;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace QuanLyThueSach.DAL
{
    public class HoaDonNhapDAL
    {
        public interface IHoaDonNhapRepository
        {
            Task<List<HoaDonNhapModel>> GetAllAsync();
            Task<HoaDonNhapModel> GetByIdAsync(string maHoaDon);
            Task<int> CreateAsync(HoaDonNhapRequest request);
            Task<int> UpdateAsync(string maHoaDon, HoaDonNhapRequest request);
            Task<int> DeleteAsync(string maHoaDon);
        }

        public class HoaDonNhapRepository : IHoaDonNhapRepository
        {
            private readonly string _con;

            public HoaDonNhapRepository(IConfiguration config)
            {
                _con = config.GetConnectionString("DefaultConnection");
            }

            public async Task<List<HoaDonNhapModel>> GetAllAsync()
            {
                var list = new List<HoaDonNhapModel>();
                using var con = new SqlConnection(_con);
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_GetHoaDonNhap", con);
                cmd.CommandType = CommandType.StoredProcedure;
                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                {
                    list.Add(new HoaDonNhapModel
                    {
                        MaHoaDonNhap = rd["MaHoaDonNhap"].ToString(),
                        NhaCungCap   = rd["NhaCungCap"].ToString(),
                        NguoiNhap    = rd["NguoiNhap"] == DBNull.Value ? null : rd["NguoiNhap"].ToString(),
                        NgayNhap     = Convert.ToDateTime(rd["NgayNhap"]),
                        TongTien     = rd["TongTien"] == DBNull.Value ? 0 : Convert.ToDecimal(rd["TongTien"]),
                        GhiChu       = rd["GhiChu"] == DBNull.Value ? null : rd["GhiChu"].ToString(),
                        SoSach       = rd["SoSach"] == DBNull.Value ? 0 : Convert.ToInt32(rd["SoSach"]),
                    });
                }
                return list;
            }

            public async Task<HoaDonNhapModel> GetByIdAsync(string maHoaDon)
            {
                HoaDonNhapModel hd = null;
                using var con = new SqlConnection(_con);
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_GetHoaDonNhapById", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaHoaDonNhap", maHoaDon);
                using var rd = await cmd.ExecuteReaderAsync();

                // ResultSet 1: header
                if (await rd.ReadAsync())
                {
                    hd = new HoaDonNhapModel
                    {
                        MaHoaDonNhap = rd["MaHoaDonNhap"].ToString(),
                        NhaCungCap   = rd["NhaCungCap"].ToString(),
                        NguoiNhap    = rd["NguoiNhap"] == DBNull.Value ? null : rd["NguoiNhap"].ToString(),
                        NgayNhap     = Convert.ToDateTime(rd["NgayNhap"]),
                        TongTien     = rd["TongTien"] == DBNull.Value ? 0 : Convert.ToDecimal(rd["TongTien"]),
                        GhiChu       = rd["GhiChu"] == DBNull.Value ? null : rd["GhiChu"].ToString(),
                        ChiTiet      = new List<ChiTietHoaDonNhapModel>(),
                    };
                }

                // ResultSet 2: chi tiết
                if (hd != null && await rd.NextResultAsync())
                {
                    while (await rd.ReadAsync())
                    {
                        hd.ChiTiet.Add(new ChiTietHoaDonNhapModel
                        {
                            MaSach    = rd["MaSach"].ToString(),
                            TenSach   = rd["TenSach"] == DBNull.Value ? "" : rd["TenSach"].ToString(),
                            SoLuong   = Convert.ToInt32(rd["SoLuong"]),
                            DonGia    = Convert.ToDecimal(rd["DonGia"]),
                            ThanhTien = Convert.ToDecimal(rd["ThanhTien"]),
                        });
                    }
                }

                return hd;
            }

            public async Task<int> CreateAsync(HoaDonNhapRequest req)
            {
                using var con = new SqlConnection(_con);
                await con.OpenAsync();
                using var tran = con.BeginTransaction();
                try
                {
                    // Sinh mã hóa đơn
                    string maHD = "HDN" + DateTime.Now.ToString("yyMMddHHmmss");

                    using var cmdHD = new SqlCommand("sp_ThemHoaDonNhap", con, tran);
                    cmdHD.CommandType = CommandType.StoredProcedure;
                    cmdHD.Parameters.AddWithValue("@MaHoaDonNhap", maHD);
                    cmdHD.Parameters.AddWithValue("@NhaCungCap",   req.NhaCungCap ?? "");
                    cmdHD.Parameters.AddWithValue("@NguoiNhap",    (object?)req.NguoiNhap ?? DBNull.Value);
                    cmdHD.Parameters.AddWithValue("@NgayNhap",     req.NgayNhap);
                    cmdHD.Parameters.AddWithValue("@TongTien",     req.TongTien);
                    cmdHD.Parameters.AddWithValue("@GhiChu",       (object?)req.GhiChu ?? DBNull.Value);
                    await cmdHD.ExecuteNonQueryAsync();

                    foreach (var ct in req.ChiTiet)
                    {
                        using var cmdCT = new SqlCommand("sp_ThemChiTietHoaDonNhap", con, tran);
                        cmdCT.CommandType = CommandType.StoredProcedure;
                        cmdCT.Parameters.AddWithValue("@MaHoaDonNhap", maHD);
                        cmdCT.Parameters.AddWithValue("@MaSach",        ct.MaSach);
                        cmdCT.Parameters.AddWithValue("@SoLuong",       ct.SoLuong);
                        cmdCT.Parameters.AddWithValue("@DonGia",        ct.DonGia);
                        cmdCT.Parameters.AddWithValue("@ThanhTien",     ct.ThanhTien);
                        await cmdCT.ExecuteNonQueryAsync();
                    }

                    await tran.CommitAsync();
                    return 1;
                }
                catch
                {
                    await tran.RollbackAsync();
                    throw;
                }
            }

            public async Task<int> UpdateAsync(string maHoaDon, HoaDonNhapRequest req)
            {
                using var con = new SqlConnection(_con);
                await con.OpenAsync();
                using var tran = con.BeginTransaction();
                try
                {
                    using var cmdHD = new SqlCommand("sp_SuaHoaDonNhap", con, tran);
                    cmdHD.CommandType = CommandType.StoredProcedure;
                    cmdHD.Parameters.AddWithValue("@MaHoaDonNhap", maHoaDon);
                    cmdHD.Parameters.AddWithValue("@NhaCungCap",   req.NhaCungCap ?? "");
                    cmdHD.Parameters.AddWithValue("@NguoiNhap",    (object?)req.NguoiNhap ?? DBNull.Value);
                    cmdHD.Parameters.AddWithValue("@NgayNhap",     req.NgayNhap);
                    cmdHD.Parameters.AddWithValue("@TongTien",     req.TongTien);
                    cmdHD.Parameters.AddWithValue("@GhiChu",       (object?)req.GhiChu ?? DBNull.Value);
                    await cmdHD.ExecuteNonQueryAsync();

                    // Xóa chi tiết cũ rồi thêm lại
                    using var cmdDel = new SqlCommand(
                        "DELETE FROM ChiTietHoaDonNhap WHERE MaHoaDonNhap = @Ma", con, tran);
                    cmdDel.Parameters.AddWithValue("@Ma", maHoaDon);
                    await cmdDel.ExecuteNonQueryAsync();

                    foreach (var ct in req.ChiTiet)
                    {
                        using var cmdCT = new SqlCommand("sp_ThemChiTietHoaDonNhap", con, tran);
                        cmdCT.CommandType = CommandType.StoredProcedure;
                        cmdCT.Parameters.AddWithValue("@MaHoaDonNhap", maHoaDon);
                        cmdCT.Parameters.AddWithValue("@MaSach",        ct.MaSach);
                        cmdCT.Parameters.AddWithValue("@SoLuong",       ct.SoLuong);
                        cmdCT.Parameters.AddWithValue("@DonGia",        ct.DonGia);
                        cmdCT.Parameters.AddWithValue("@ThanhTien",     ct.ThanhTien);
                        await cmdCT.ExecuteNonQueryAsync();
                    }

                    await tran.CommitAsync();
                    return 1;
                }
                catch
                {
                    await tran.RollbackAsync();
                    throw;
                }
            }

            public async Task<int> DeleteAsync(string maHoaDon)
            {
                using var con = new SqlConnection(_con);
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_XoaHoaDonNhap", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaHoaDonNhap", maHoaDon);
                return await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
