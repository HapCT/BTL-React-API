using QuanLyThueSach.Models;

namespace QuanLyThueSach.BLL
{
    public class ThanhToanBLL
    {
        public interface IThanhToanServices
        {
            Task<Respon<List<ThanhToanViewModel>>> GetAsync();
            Task<Respon<ThanhToanViewModel?>> GetHoaDonAsync(string maThanhToan);
            Task<Respon<int>> ThanhToanAsync(ThanhToanRequest request);
            Task<Respon<int>> HuyThanhToanAsync(string maThanhToan);
        }

        public class ThanhToanService : IThanhToanServices
        {
            private readonly DAL.ThanhToanDAL.IThanhToanRepository _repository;

            public ThanhToanService(DAL.ThanhToanDAL.IThanhToanRepository repository)
            {
                _repository = repository;
            }

            // 🔹 Lấy danh sách thanh toán
            public async Task<Respon<List<ThanhToanViewModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();

                    return new Respon<List<ThanhToanViewModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách thanh toán thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<ThanhToanViewModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }
            public async Task<Respon<int>> ThanhToanAsync(ThanhToanRequest request)
            {
                try
                {
                    var result = await _repository.ThanhToanAsync(request);
                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Thanh toán thành công",
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
            // 🔹 Lấy hoá đơn theo mã
            public async Task<Respon<ThanhToanViewModel?>> GetHoaDonAsync(string maThanhToan)
            {
                try
                {
                    var model = await _repository.GetHoaDonAsync(maThanhToan);

                    if (model == null)
                    {
                        return new Respon<ThanhToanViewModel?>
                        {
                            StatusCode = 404,
                            Message = "Không tìm thấy hoá đơn",
                            Data = null
                        };
                    }

                    return new Respon<ThanhToanViewModel?>
                    {
                        StatusCode = 200,
                        Message = "Lấy hoá đơn thành công",
                        Data = model
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<ThanhToanViewModel?>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // 🔹 Huỷ thanh toán
            public async Task<Respon<int>> HuyThanhToanAsync(string maThanhToan)
            {
                try
                {
                    var result = await _repository.HuyThanhToanAsync(maThanhToan);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Huỷ thanh toán thành công",
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