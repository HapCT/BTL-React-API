using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.BLL
{
    public class KeSachBLL
    {
        public interface IKeSachServices
        {
            Task<Respon<List<KeSachModel>>> GetAsync();
            Task<Respon<int>> ThemKeAsync(ThemKeSach themKeSach);
            Task<Respon<List<KeSachModel>>> TimKeIdAsync(string maKe);
            Task<Respon<List<KeSachModel>>> SearchAsync(string tuKhoa);
            Task<Respon<int>> SuaKeAsync(string maKe, SuaKeSach suaKeSach);
            Task<Respon<int>> XoaKeAsync(string maKe);
        }

        public class KeSachService : IKeSachServices
        {
            private readonly DAL.KeSachDAL.IKeSachRepository _repository;

            public KeSachService(DAL.KeSachDAL.IKeSachRepository repository)
            {
                _repository = repository;
            }

            public async Task<Respon<List<KeSachModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();

                    return new Respon<List<KeSachModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách kệ sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<KeSachModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> ThemKeAsync(ThemKeSach themKeSach)
            {
                try
                {
                    var result = await _repository.ThemKeAsync(themKeSach);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Thêm kệ sách thành công",
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

            public async Task<Respon<List<KeSachModel>>> TimKeIdAsync(string maKe)
            {
                try
                {
                    var list = await _repository.TimKeIdAsync(maKe);

                    return new Respon<List<KeSachModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm kệ sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<KeSachModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<List<KeSachModel>>> SearchAsync(string tuKhoa)
            {
                try
                {
                    var list = await _repository.SearchAsync(tuKhoa);

                    return new Respon<List<KeSachModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm kiếm kệ sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<KeSachModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> SuaKeAsync(string maKe, SuaKeSach suaKeSach)
            {
                try
                {
                    var result = await _repository.SuaKeAsync(maKe, suaKeSach);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Sửa kệ sách thành công",
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

            public async Task<Respon<int>> XoaKeAsync(string maKe)
            {
                try
                {
                    var result = await _repository.XoaKeAsync(maKe);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xóa kệ sách thành công",
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