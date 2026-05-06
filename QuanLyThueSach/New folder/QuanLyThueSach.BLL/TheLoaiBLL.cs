using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.BLL
{
    public class TheLoaiBLL
    {
        public interface ITheLoaiServices
        {
            Task<Respon<List<TheLoaiModel>>> GetAsync();
            Task<Respon<int>> ThemTLAsync(ThemTheLoai themTheLoai);
            Task<Respon<List<TheLoaiModel>>> TimTLidAsync(string MaTheLoai);
            Task<Respon<List<TheLoaiModel>>> SearchAsync(string tuKhoa);
            Task<Respon<int>> SuaTLAsync(string maTheLoai, SuaTheLoai suaTheLoai);
            Task<Respon<int>> XoaTaiKhoanAsync(string MaTheLoai);
        }
        public class TheLoaiService : ITheLoaiServices
        {
            private readonly DAL.TheLoaiDAL.ITheLoaiRepository _repository;
            public TheLoaiService(DAL.TheLoaiDAL.ITheLoaiRepository repository)
            {
                _repository = repository;
            }
            public async Task<Respon<List<TheLoaiModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();
                    return new Respon<List<TheLoaiModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<TheLoaiModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
            public async Task<Respon<int>> ThemTLAsync(ThemTheLoai themTheLoai)
            {
                try
                {
                    var result = await _repository.ThemTLAsync(themTheLoai);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Thêm thể loại thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = 0
                    };
                }
            }
            public async Task<Respon<List<TheLoaiModel>>> TimTLidAsync(string MaTheLoai)
            {
                try
                {
                    var list = await _repository.TimTLidAsync(MaTheLoai);
                    return new Respon<List<TheLoaiModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm kiếm thể loại thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<TheLoaiModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
            public async Task<Respon<List<TheLoaiModel>>> SearchAsync(string tuKhoa)
            {
                try
                {
                    var list = await _repository.SearchAsync(tuKhoa);
                    return new Respon<List<TheLoaiModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm kiếm thể loại thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<TheLoaiModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
            public async Task<Respon<int>> SuaTLAsync( string maTheLoai, SuaTheLoai suaTheLoai)
            {
                try
                {
                    var result = await _repository.SuaTLAsync(maTheLoai, suaTheLoai);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Sửa thể loại thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = 0
                    };
                }
            }
            public async Task<Respon<int>> XoaTaiKhoanAsync(string MaTheLoai)
            {
                try
                {
                    var result = await _repository.XoaTaiKhoanAsync(MaTheLoai);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xóa thể loại thành công",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = 0
                    };
                }
            }
        }
    }
}
