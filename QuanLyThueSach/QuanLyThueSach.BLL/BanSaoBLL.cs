using QuanLyThueSach.Models;

namespace QuanLyThueSach.BLL
{
    public class BanSaoBLL
    {
        public interface IBanSaoServices
        {
            Task<Respon<List<BanSaoModel>>> GetAsync();
            Task<Respon<int>> ThemBanSaoAsync(ThemBanSao themBanSao);
            Task<Respon<List<BanSaoModel>>> TimBanSaoIDAsync(string maBanSao);
            Task<Respon<List<BanSaoModel>>> SearchAsync(string tuKhoa);
            Task<Respon<int>> SuaBanSaoAsync(string maBanSao, SuaBanSao suaBanSao);
            Task<Respon<int>> XoaNhieuAsync(List<string> dsMaBanSao);
        }

        public class BanSaoService : IBanSaoServices
        {
            private readonly DAL.BanSaoDAL.IBanSaoRepository _repository;

            public BanSaoService(DAL.BanSaoDAL.IBanSaoRepository repository)
            {
                _repository = repository;
            }

            // Lấy danh sách bản sao
            public async Task<Respon<List<BanSaoModel>>> GetAsync()
            {
                try
                {
                    var list = await _repository.GetAsync();

                    return new Respon<List<BanSaoModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy danh sách bản sao thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<BanSaoModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // Thêm bản sao
            public async Task<Respon<int>> ThemBanSaoAsync(ThemBanSao themBanSao)
            {
                try
                {
                    var result = await _repository.ThemBanSaoAsync(themBanSao);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Thêm bản sao thành công",
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

            // Tìm bản sao theo ID
            public async Task<Respon<List<BanSaoModel>>> TimBanSaoIDAsync(string maBanSao)
            {
                try
                {
                    var list = await _repository.TimBanSaoIDAsync(maBanSao);

                    return new Respon<List<BanSaoModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm bản sao thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<BanSaoModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // Tìm kiếm bản sao
            public async Task<Respon<List<BanSaoModel>>> SearchAsync(string tuKhoa)
            {
                try
                {
                    var list = await _repository.SearchAsync(tuKhoa);

                    return new Respon<List<BanSaoModel>>
                    {
                        StatusCode = 200,
                        Message = "Tìm kiếm bản sao thành công",
                        Data = list
                    };
                }
                catch (Exception ex)
                {
                    return new Respon<List<BanSaoModel>>
                    {
                        StatusCode = 500,
                        Message = $"Lỗi: {ex.Message}",
                        Data = null
                    };
                }
            }

            // Sửa bản sao
            public async Task<Respon<int>> SuaBanSaoAsync(string maBanSao, SuaBanSao suaBanSao)
            {
                try
                {
                    var result = await _repository.SuaBanSaoAsync(maBanSao, suaBanSao);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Sửa bản sao thành công",
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

            // Xóa bản sao
            public async Task<Respon<int>> XoaNhieuAsync(List<string> dsMaBanSao)
            {
                try
                {
                    var result = await _repository.XoaNhieuAsync(dsMaBanSao);

                    return new Respon<int>
                    {
                        StatusCode = 200,
                        Message = "Xóa bản sao thành công",
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