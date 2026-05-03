using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuanLyThueSach.BLL
{
    public class HoaDonNhapBLL
    {
        public interface IHoaDonNhapServices
        {
            Task<Respon<List<HoaDonNhapModel>>> GetAllAsync();
            Task<Respon<HoaDonNhapModel>> GetByIdAsync(string maHoaDon);
            Task<Respon<int>> CreateAsync(HoaDonNhapRequest request);
            Task<Respon<int>> UpdateAsync(string maHoaDon, HoaDonNhapRequest request);
            Task<Respon<int>> DeleteAsync(string maHoaDon);
        }

        public class HoaDonNhapService : IHoaDonNhapServices
        {
            private readonly HoaDonNhapDAL.IHoaDonNhapRepository _repo;

            public HoaDonNhapService(HoaDonNhapDAL.IHoaDonNhapRepository repo)
            {
                _repo = repo;
            }

            public async Task<Respon<List<HoaDonNhapModel>>> GetAllAsync()
            {
                try
                {
                    var list = await _repo.GetAllAsync();
                    return new Respon<List<HoaDonNhapModel>>
                    {
                        StatusCode = 200,
                        Message = "OK",
                        Data = list
                    };
                }
                catch (System.Exception ex)
                {
                    return new Respon<List<HoaDonNhapModel>>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            public async Task<Respon<HoaDonNhapModel>> GetByIdAsync(string maHoaDon)
            {
                try
                {
                    var hd = await _repo.GetByIdAsync(maHoaDon);
                    if (hd == null)
                        return new Respon<HoaDonNhapModel>
                        {
                            StatusCode = 404,
                            Message = "Không tìm thấy hóa đơn",
                            Data = null
                        };

                    return new Respon<HoaDonNhapModel>
                    {
                        StatusCode = 200,
                        Message = "OK",
                        Data = hd
                    };
                }
                catch (System.Exception ex)
                {
                    return new Respon<HoaDonNhapModel>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            public async Task<Respon<int>> CreateAsync(HoaDonNhapRequest request)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(request.NhaCungCap))
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Nhà cung cấp không được để trống",
                            Data = 0
                        };

                    if (request.ChiTiet == null || request.ChiTiet.Count == 0)
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Hóa đơn phải có ít nhất 1 sách",
                            Data = 0
                        };

                    var result = await _repo.CreateAsync(request);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Tạo hóa đơn nhập thành công",
                        Data = result
                    };
                }
                catch (System.Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = 0
                    };
                }
            }

            public async Task<Respon<int>> UpdateAsync(string maHoaDon, HoaDonNhapRequest request)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(maHoaDon))
                        return new Respon<int>
                        {
                            StatusCode = 400,
                            Message = "Mã hóa đơn không hợp lệ",
                            Data = 0
                        };

                    var result = await _repo.UpdateAsync(maHoaDon, request);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Cập nhật hóa đơn nhập thành công",
                        Data = result
                    };
                }
                catch (System.Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = 0
                    };
                }
            }

            public async Task<Respon<int>> DeleteAsync(string maHoaDon)
            {
                try
                {
                    var result = await _repo.DeleteAsync(maHoaDon);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xóa hóa đơn nhập thành công",
                        Data = result
                    };
                }
                catch (System.Exception ex)
                {
                    return new Respon<int>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = 0
                    };
                }
            }
        }
    }
}
