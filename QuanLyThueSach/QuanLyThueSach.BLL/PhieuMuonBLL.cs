using QuanLyThueSach.DAL;
using QuanLyThueSach.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static QuanLyThueSach.DAL.PhieuMuonDAL;

namespace QuanLyThueSach.BLL
{
    public class PhieuMuonBLL
    {
        public interface IPhieuMuonServices
        {
            Task<Respon<List<PhieuMuonViewModel>>> GetAsync();
            Task<Respon<List<PhieuMuonViewModel>>> GetByBanDocAsync(string maBanDoc);
            Task<Respon<object>> XoaPhieuMuonAsync(string maPhieuMuon);
            Task<Respon<string>> DangKyMuonAsync(MuonOline model);
            Task<Respon<string>> DangKyMuonOff(TaoPhieuMuonOfflineRequest request);
            Task<Respon<string>> DuyetMuonAsync(string maPhieuMuon);
            Task<Respon<string>> TraSachAsync(string maPhieuMuon);
            Task<Respon<string>> GiaHanAsync(string maPhieuMuon, int soNgayThem);
            Task<Respon<string>> HuyAsync(string maPhieuMuon);
        }

        public class PhieuMuonService : IPhieuMuonServices
        {
            private readonly IPhieuMuonRepository _repository;

            public PhieuMuonService(IPhieuMuonRepository repository)
            {
                _repository = repository;
            }

            // 🔹 Lấy danh sách
            public async Task<Respon<List<PhieuMuonViewModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();
                    return new Respon<List<PhieuMuonViewModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<PhieuMuonViewModel>>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            // 🔹 Theo bạn đọc
            public async Task<Respon<List<PhieuMuonViewModel>>> GetByBanDocAsync(string maBanDoc)
            {
                try
                {
                    var list = await _repository.TimTheoBanDocAsync(maBanDoc);
                    return new Respon<List<PhieuMuonViewModel>>
                    {
                        StatusCode = 200,
                        Message = "Thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<PhieuMuonViewModel>>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            // 🔹 Đăng ký mượn
            public async Task<Respon<string>> DangKyMuonAsync(MuonOline model)
            {
                try
                {
                    await _repository.DangKyMuonAsync(model);
                    return new Respon<string>
                    {
                        StatusCode = 200,
                        Message = "Đăng ký mượn thành công",
                        Data = null
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<string>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }
            public async Task<Respon<string>> DangKyMuonOff(TaoPhieuMuonOfflineRequest request)
            {
                try
                {
                    await _repository.DangKyMuonOff(request);
                    return new Respon<string>
                    {
                        StatusCode = 200,
                        Message = "Đăng ký mượn offline thành công",
                        Data = null
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<string>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }
            // 🔹 Duyệt mượn
            public async Task<Respon<string>> DuyetMuonAsync(string maPhieuMuon)
            {
                try
                {
                    await _repository.DuyetMuonAsync(maPhieuMuon);
                    return new Respon<string>
                    {
                        StatusCode = 200,
                        Message = "Duyệt mượn thành công",
                        Data = null
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<string>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            // 🔹 Trả sách
            public async Task<Respon<string>> TraSachAsync(string maPhieuMuon)
            {
                try
                {
                    await _repository.TraSachAsync(maPhieuMuon);
                    return new Respon<string>
                    {
                        StatusCode = 200,
                        Message = "Trả sách thành công",
                        Data = null
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<string>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            // 🔹 Gia hạn
            public async Task<Respon<string>> GiaHanAsync(string maPhieuMuon, int soNgayThem)
            {
                try
                {
                    await _repository.GiaHanAsync(maPhieuMuon, soNgayThem);
                    return new Respon<string>
                    {
                        StatusCode = 200,
                        Message = "Gia hạn thành công",
                        Data = null
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<string>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            // 🔹 Hủy
            public async Task<Respon<string>> HuyAsync(string maPhieuMuon)
            {
                try
                {
                    await _repository.HuyAsync(maPhieuMuon);
                    return new Respon<string>
                    {
                        StatusCode = 200,
                        Message = "Hủy phiếu mượn thành công",
                        Data = null
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<string>
                    {
                        StatusCode = 500,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }
            public async Task<Respon<object>> XoaPhieuMuonAsync(string maPhieuMuon)
            {
                var result = await _repository.XoaPhieuMuon(maPhieuMuon);

                if (!result)
                {
                    return new Respon<object>
                    {
                        StatusCode = 400,
                        Message = "Xoá thất bại hoặc không hợp lệ"
                    };
                }

                return new Respon<object>
                {
                    StatusCode = 200,
                    Message = "Xoá phiếu thành công"
                };
            }
        }
    }
}