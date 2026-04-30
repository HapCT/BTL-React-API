using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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
            Task<Respon<SachModel>> TimSachIDAsync(string maSach);
            Task<Respon<List<SachModel>>> TimSachAsync(string tuKhoa);
            Task<Respon<List<SachPhoBienModel>>> GetSachPhoBienAsync();
        }

        public class SachService : ISachServices
        {
            private readonly SachDAL.ISachRepository _repo;

            public SachService(SachDAL.ISachRepository repo) => _repo = repo;

            public async Task<Respon<List<SachModel>>> GetAsync()
            {
                try
                {
                    var list = await _repo.GetAsync();
                    return new Respon<List<SachModel>> { StatusCode = 200, Message = "OK", Data = list };
                }
                catch (System.Exception ex)
                {
                    return new Respon<List<SachModel>> { StatusCode = 500, Message = ex.Message, Data = null };
                }
            }

            public async Task<Respon<int>> ThemSachAsync(ThemSach themSach)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(themSach.TieuDe))
                        return new Respon<int> { StatusCode = 400, Message = "Tiêu đề không được để trống", Data = 0 };

                    var result = await _repo.ThemSach(themSach);
                    return new Respon<int> { StatusCode = 200, Message = "Thêm sách thành công", Data = result };
                }
                catch (System.Exception ex)
                {
                    return new Respon<int> { StatusCode = 500, Message = ex.Message, Data = 0 };
                }
            }

            public async Task<Respon<int>> SuaSachAsync(string maSach, SuaSach suaSach)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(maSach))
                        return new Respon<int> { StatusCode = 400, Message = "Mã sách không hợp lệ", Data = 0 };

                    var result = await _repo.SuaSach(maSach, suaSach);
                    return new Respon<int> { StatusCode = 200, Message = "Sửa sách thành công", Data = result };
                }
                catch (System.Exception ex)
                {
                    return new Respon<int> { StatusCode = 500, Message = ex.Message, Data = 0 };
                }
            }

            public async Task<Respon<int>> XoaSachAsync(string maSach)
            {
                try
                {
                    var result = await _repo.XoaSachAsync(maSach);
                    return new Respon<int> { StatusCode = 200, Message = "Xóa sách thành công", Data = result };
                }
                catch (System.Exception ex)
                {
                    return new Respon<int> { StatusCode = 500, Message = ex.Message, Data = 0 };
                }
            }

            public async Task<Respon<SachModel>> TimSachIDAsync(string maSach)
            {
                try
                {
                    var sach = await _repo.TimSachIDAsync(maSach);
                    return new Respon<SachModel>
                    {
                        StatusCode = 200,
                        Message = sach != null ? "OK" : "Không tìm thấy",
                        Data = sach
                    };
                }
                catch (System.Exception ex)
                {
                    return new Respon<SachModel> { StatusCode = 500, Message = ex.Message, Data = null };
                }
            }

            public async Task<Respon<List<SachModel>>> TimSachAsync(string tuKhoa)
            {
                try
                {
                    var list = await _repo.TimSachAsync(tuKhoa);
                    return new Respon<List<SachModel>> { StatusCode = 200, Message = "OK", Data = list };
                }
                catch (System.Exception ex)
                {
                    return new Respon<List<SachModel>> { StatusCode = 500, Message = ex.Message, Data = null };
                }
            }

            public async Task<Respon<List<SachPhoBienModel>>> GetSachPhoBienAsync()
            {
                try
                {
                    var data = await _repo.GetSachPhoBienAsync();
                    return new Respon<List<SachPhoBienModel>> { StatusCode = 200, Message = "OK", Data = data };
                }
                catch (System.Exception ex)
                {
                    return new Respon<List<SachPhoBienModel>> { StatusCode = 500, Message = ex.Message, Data = null };
                }
            }
        }
    }
}
