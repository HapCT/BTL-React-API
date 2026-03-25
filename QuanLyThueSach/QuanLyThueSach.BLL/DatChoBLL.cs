using QuanLyThueSach.Models;

namespace QuanLyThueSach.BLL
{
    public class DatChoBLL
    {
        public interface IDatChoServices
        {
            Task<Respon<List<DatChoModel>>> GetAsync();
            Task<Respon<int>> DatChoAsync(TaoDatChoRequest request);
            Task<Respon<int>> HuyDatChoAsync(string maDatCho);
            Task<Respon<int>> HetHanDatChoAsync();
            Task<Respon<int>> TuDongMuonAsync(string maSach);
        }

        public class DatChoService : IDatChoServices
        {
            private readonly DAL.DatChoDAL.IDatChoRepository _repository;

            public DatChoService(DAL.DatChoDAL.IDatChoRepository repository)
            {
                _repository = repository;
            }

            // 🔹 Lấy danh sách đặt chỗ
            public async Task<Respon<List<DatChoModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();

                    return new Respon<List<DatChoModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách đặt chỗ thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<DatChoModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // 🔹 Đặt chỗ
            public async Task<Respon<int>> DatChoAsync(TaoDatChoRequest request)
            {
                try
                {
                    var result = await _repository.DatChoAsync(request);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Đặt chỗ thành công",
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

            // 🔹 Huỷ đặt chỗ
            public async Task<Respon<int>> HuyDatChoAsync(string maDatCho)
            {
                try
                {
                    var result = await _repository.HuyDatChoAsync(maDatCho);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Huỷ đặt chỗ thành công",
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

            // 🔹 Tự động hết hạn
            public async Task<Respon<int>> HetHanDatChoAsync()
            {
                try
                {
                    var result = await _repository.HetHanDatChoAsync();

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Cập nhật hết hạn thành công",
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

            // 🔹 Tự động mượn từ đặt chỗ
            public async Task<Respon<int>> TuDongMuonAsync(string maSach)
            {
                try
                {
                    var result = await _repository.TuDongMuonAsync(maSach);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Tự động mượn từ đặt chỗ thành công",
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