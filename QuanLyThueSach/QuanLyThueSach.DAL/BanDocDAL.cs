using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuanLyThueSach.Models;
using System.Data.SqlClient;
using System.Data;
using Microsoft.VisualBasic;
using Microsoft.Extensions.Configuration;
namespace QuanLyThueSach.DAL
{
    public class BanDocDAL
    {
        public interface IBanDocRespository
        {
            Task<List<BanDocModel>> GetBanDocAsync();
            Task<BanDocModel> GetBanDocByIdAsync(string maBanDoc);
            Task<List<BanDocModel>> SearchBanDocAsync(string tuKhoa);
            Task<int> CreateAsync(CreateBanDoc createBanDoc);
            Task<int> UpdateAsync(string maBanDoc, UpdateBanDoc updateBanDoc);
            Task<int> DeleteAsync(string maBanDoc);
        }
        public class BanDocResponsive : IBanDocRespository
        {
            private readonly string _con;
            public BanDocResponsive(IConfiguration configuration)
            {
                _con = configuration.GetConnectionString("DefaultConnection");
            }
            public async Task<List<BanDocModel>> GetBanDocAsync()
            {
                var list = new List<BanDocModel>();
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_HienBanDoc", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                using var rd = await cmd.ExecuteReaderAsync();
                while (rd.Read())
                {
                    list.Add(new BanDocModel
                    {
                        MaBanDoc = rd.GetString(0),
                        SoThe = rd.GetString(1),
                        HoTen = rd.GetString(2),
                        Email = rd.GetString(3),
                        SoDienThoai = rd.GetString(4),
                        HanThe = rd.GetDateTime(5),
                        TrangThaiThe = rd.GetString(6),
                        DuNo = rd.GetDecimal(7),
                        CCCD = rd.GetString(8)
                    });
                }
                return list;

            }
            public async Task<BanDocModel> GetBanDocByIdAsync(string maBanDoc)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_TimBanDocTheoID", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync())
                {
                    return new BanDocModel
                    {
                        MaBanDoc = rd.GetString(0),
                        SoThe = rd.GetString(1),
                        HoTen = rd.GetString(2),
                        Email = rd.GetString(3),
                        SoDienThoai = rd.GetString(4),
                        HanThe = rd.GetDateTime(5),
                        TrangThaiThe = rd.GetString(6),
                        DuNo = rd.GetDecimal(7),
                        CCCD = rd.GetString(8)
                    };
                }
                return null;
            }
            public async Task<List<BanDocModel>> SearchBanDocAsync(string tuKhoa)
            {
                var list = new List<BanDocModel>();

                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();

                using var cmd = new SqlCommand("sp_TimBanDoc", connect);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TuKhoa", tuKhoa);

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new BanDocModel
                    {
                        MaBanDoc = rd.GetString(0),
                        SoThe = rd.GetString(1),
                        HoTen = rd.GetString(2),
                        Email = rd.GetString(3),
                        SoDienThoai = rd.GetString(4),
                        HanThe = rd.GetDateTime(5),
                        TrangThaiThe = rd.GetString(6),
                        DuNo = rd.GetDecimal(7),
                        CCCD = rd.GetString(8)
                    });
                }

                return list;
            }
            public async Task<int> CreateAsync(CreateBanDoc createBanDoc)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_ThemBanDoc", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Hoten", createBanDoc.HoTen);
                cmd.Parameters.AddWithValue("@Email", createBanDoc.Email);
                cmd.Parameters.AddWithValue("@SoDienThoai", createBanDoc.SoDienThoai);
                cmd.Parameters.AddWithValue("@HanThe", createBanDoc.HanThe);
                cmd.Parameters.AddWithValue("@CCCD", createBanDoc.CCCD);
                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<int> UpdateAsync(string maBanDoc, UpdateBanDoc updateBanDoc)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_SuaBanDoc", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                cmd.Parameters.AddWithValue("@Hoten", updateBanDoc.Hoten);
                cmd.Parameters.AddWithValue("@Email", updateBanDoc.Email);
                cmd.Parameters.AddWithValue("@SoDienThoai", updateBanDoc.SoDienThoai);
                cmd.Parameters.AddWithValue("@HanThe", updateBanDoc.HanThe);
                cmd.Parameters.AddWithValue("@TrangThaiThe", updateBanDoc.TrangThaiThe);
                cmd.Parameters.AddWithValue("@DuNo", updateBanDoc.DuNo);
                cmd.Parameters.AddWithValue("@CCCD", updateBanDoc.CCCD);
                return await cmd.ExecuteNonQueryAsync();
            }
            public async Task<int> DeleteAsync(string maBanDoc)
            {
                using var connect = new SqlConnection(_con);
                await connect.OpenAsync();
                using var cmd = new SqlCommand("sp_XoaBanDoc", connect);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);
                return await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
