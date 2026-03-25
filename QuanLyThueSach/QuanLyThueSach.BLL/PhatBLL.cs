using QuanLyThueSach.Models;

namespace QuanLyThueSach.BLL
{
    public class PhatBLL
    {
        public interface IPhatServices
        {
            Task<Respon<List<PhatViewModel>>> GetAsync();
            Task<Respon<List<PhatViewModel>>> SearchAsync(string keyword, string trangThai);
            Task<Respon<int>> TaoPhatAsync(TaoPhatRequest request);
            Task<Respon<int>> ThanhToanPhatAsync(string maPhat);
            Task<Respon<int>> HuyPhatAsync(string maPhat);
        }

        public class PhatService : IPhatServices
        {
            private readonly DAL.PhatDAL.IPhatRepository _repository;

            public PhatService(DAL.PhatDAL.IPhatRepository repository)
            {
                _repository = repository;
            }

            // 🔹 Lấy danh sách phạt
            public async Task<Respon<List<PhatViewModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();

                    return new Respon<List<PhatViewModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách phạt thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<PhatViewModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // 🔹 Tìm kiếm phạt
            public async Task<Respon<List<PhatViewModel>>> SearchAsync(string keyword, string trangThai)
            {
                try
                {
                    var list = await _repository.SearchAsync(keyword, trangThai);

                    return new Respon<List<PhatViewModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm kiếm phạt thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<PhatViewModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // 🔹 Tạo phạt
            public async Task<Respon<int>> TaoPhatAsync(TaoPhatRequest request)
            {
                try
                {
                    var result = await _repository.TaoPhatAsync(request);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Tạo phạt thành công",
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

            // 🔹 Thanh toán phạt
            public async Task<Respon<int>> ThanhToanPhatAsync(string maPhat)
            {
                try
                {
                    var result = await _repository.ThanhToanPhatAsync(maPhat);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Thanh toán phạt thành công",
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

            // 🔹 Huỷ phạt
            public async Task<Respon<int>> HuyPhatAsync(string maPhat)
            {
                try
                {
                    var result = await _repository.HuyPhatAsync(maPhat);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Huỷ phạt thành công",
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