using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static QuanLyThueSach.DAL.BanDocDAL;

namespace QuanLyThueSach.BLL
{
    public class BanDocBLL
    {
        public interface IBanDocServices
        {
            Task<Respon<List<BanDocModel>>> GetBanDocAsync();
            Task<Respon<BanDocModel>> GetBanDocByIdAsync(string maBanDoc);
            Task<List<BanDocModel>> SearchBanDocAsync(string tuKhoa);
            Task<int> CreateAsync(CreateBanDoc createBanDoc);
            Task<int> UpdateAsync(string maBanDoc, UpdateBanDoc updateBanDoc);
            Task<int> DeleteAsync(string maBanDoc);
        }
        public class BanDocService : IBanDocServices
        {
            private readonly IBanDocRespository _respository;
            public BanDocService(IBanDocRespository respository)
            {
                _respository = respository;
            }
            public async Task<Respon<List<BanDocModel>>> GetBanDocAsync()
            {
                try
                {
                    var list = await _respository.GetBanDocAsync();
                    return new Respon<List<BanDocModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy dữ liệu thành công",
                        Data = list
                    };
                }
                catch(Exception ex)
                {
                    return new Respon<List<BanDocModel>>
                    {
                        StatusCode = 404,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
                
            }
            public async Task<Respon<BanDocModel>> GetBanDocByIdAsync(string maBanDoc)
            {
                try
                {
                    var banDoc = await _respository.GetBanDocByIdAsync(maBanDoc);

                    if (banDoc == null)
                    {
                        return new Respon<BanDocModel>
                        {
                            StatusCode = 200,
                            Message = "Không tìm thấy bạn đọc",
                            Data = null
                        };
                    }

                    return new Respon<BanDocModel>
                    {
                        StatusCode = 200,
                        Message = "Lấy thông tin thành công",
                        Data = banDoc
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<BanDocModel>
                    {
                        StatusCode = 404,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
            private string MapTrangThai(string input)
            {
                return input switch
                {
                    "ACTIVE" => "Hoạt động",
                    "LOCKED" => "Bị Khoá",
                    "EXPIRED" => "Hết hạn",
                    "INACTIVE" => "Ngừng sử dụng",
                    _ => throw new Exception("Trạng thái không hợp lệ")
                };
            }
            public async Task<List<BanDocModel>> SearchBanDocAsync(string tuKhoa)
            {
                return await _respository.SearchBanDocAsync(tuKhoa);
            }
            public async Task<int> CreateAsync(CreateBanDoc createBanDoc)
            {
                var trangThai = MapTrangThai(createBanDoc.TrangThaiThe);
                createBanDoc.TrangThaiThe = trangThai;
                return await _respository.CreateAsync(createBanDoc);
            }
            public async Task<int> UpdateAsync(string maBanDoc, UpdateBanDoc updateBanDoc)
            {
                updateBanDoc.TrangThaiThe = MapTrangThai(updateBanDoc.TrangThaiThe);
                return await _respository.UpdateAsync(maBanDoc, updateBanDoc);
            }
            public async Task<int> DeleteAsync(string maBanDoc)
            {
                return await _respository.DeleteAsync(maBanDoc);
            }
        }
    }
}
