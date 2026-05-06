using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuanLyThueSach.BLL;
using static QuanLyThueSach.BLL.DatChoBLL;

namespace QuanLyThueSach.Services
{
    public class DatChoBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public DatChoBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var datChoService = scope.ServiceProvider.GetRequiredService<IDatChoServices>();

                    // 🔥 Tự động hết hạn
                    await datChoService.HetHanDatChoAsync();
                }

                // ⏱ chạy mỗi 1 phút
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}