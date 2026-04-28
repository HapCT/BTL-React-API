using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;

namespace QuanLyThueSach.BLL
{
    public class SachBLL
    {
        public interface ISachServices
        {
            Task<Respon<List<SachModel>>> GetAsync();
            Task<Respon<int>> ThemSachAsync(ThemSach themSach);
            Task<Respon<int>> SuaSachAsync(string maSach, SuaSach suaSach);
            Task<Respon<int>> XoaSachAsync(string maSach);
            Task<Respon<List<SachModel>>> TimSachIDAsync(string maSach);
            Task<Respon<List<SachModel>>> TimSachAsync(string tuKhoa);
            Task<Respon<List<SachPhoBienModel>>> GetSachPhoBienAsync();
        }

        public class SachService : ISachServices
        {
            private readonly SachDAL.ISachRepository _repository;

            public SachService(SachDAL.ISachRepository repository)
            {
                _repository = repository;
            }

            public async Task<Respon<List<SachModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();

                    return new Respon<List<SachModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<SachModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> ThemSachAsync(ThemSach themSach)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(themSach.TieuDe))
                    {
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Tiêu đề sách không được để trống",
                            Data = 0
                        };
                    }

                    var result = await _repository.ThemSach(themSach);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Thêm sách thành công",
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

            public async Task<Respon<int>> SuaSachAsync(string maSach, SuaSach suaSach)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(maSach))
                    {
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Mã sách không hợp lệ",
                            Data = 0
                        };
                    }

                    var result = await _repository.SuaSach(maSach, suaSach);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Sửa sách thành công",
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

            public async Task<Respon<int>> XoaSachAsync(string maSach)
            {
                try
                {
                    var result = await _repository.XoaSachAsync(maSach);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xóa sách thành công",
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

            public async Task<Respon<List<SachModel>>> TimSachIDAsync(string maSach)
            {
                try
                {
                    var list = await _repository.TimSachIDAsync(maSach);

                    if (list == null || list.Count == 0)
                    {
                        return new Respon<List<SachModel>>
                        {
                            StatusCode = 200,
                            Message = "Không tìm thấy sách",
                            Data = list
                        };
                    }

                    return new Respon<List<SachModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<SachModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<Respon<List<SachModel>>> TimSachAsync(string tuKhoa)
            {
                try
                {
                    var list = await _repository.TimSachAsync(tuKhoa);

                    if (list == null || list.Count == 0)
                    {
                        return new Respon<List<SachModel>>
                        {
                            StatusCode = 200,
                            Message = "Không tìm thấy dữ liệu",
                            Data = list
                        };
                    }

                    return new Respon<List<SachModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<SachModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
            public async Task<Respon<List<SachPhoBienModel>>> GetSachPhoBienAsync()
            {
                var data = await _repository.GetSachPhoBienAsync();

                return new Respon<List<SachPhoBienModel>>
                {
                    StatusCode = 200,
                    Message = "Lấy sách phổ biến thành công",
                    Data = data
                };
            }
        }
    }
}