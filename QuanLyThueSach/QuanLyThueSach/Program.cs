using QuanLyThueSach.BLL;
using QuanLyThueSach.DAL;
using static QuanLyThueSach.BLL.BanSaoBLL;
using static QuanLyThueSach.BLL.KeSachBLL;
using static QuanLyThueSach.DAL.BanSaoDAL;
using static QuanLyThueSach.DAL.KeSachDAL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

//bạn đọc
builder.Services.AddScoped<BanDocBLL.IBanDocServices, BanDocBLL.BanDocService>();
builder.Services.AddScoped<BanDocDAL.IBanDocRespository, BanDocDAL.BanDocResponsive>();

//Tài khoản
builder.Services.AddScoped<TaiKhoanBLL.ITaiKhoanServices, TaiKhoanBLL.TaiKhoanService>();
builder.Services.AddScoped<TaiKhoanDAL.ITaiKhoanRepository, TaiKhoanDAL.TaiKhoanReponsitory>();
// Thể loại
builder.Services.AddScoped<TheLoaiBLL.ITheLoaiServices, TheLoaiBLL.TheLoaiService>();
builder.Services.AddScoped<TheLoaiDAL.ITheLoaiRepository, TheLoaiDAL.TheLoaiReponsitory>();
//Sách
builder.Services.AddScoped<SachBLL.ISachServices, SachBLL.SachService>();
builder.Services.AddScoped<SachDAL.ISachRepository, SachDAL.SachRepository>();
//Kệ sách
builder.Services.AddScoped<IKeSachRepository, KeSachRepository>();
builder.Services.AddScoped<IKeSachServices, KeSachService>();
//Bản sao
builder.Services.AddScoped<IBanSaoRepository, BanSaoRepository>();
builder.Services.AddScoped<IBanSaoServices, BanSaoService>();
//Phiếu mượn
builder.Services.AddScoped<PhieuMuonBLL.IPhieuMuonServices, PhieuMuonBLL.PhieuMuonService>();
builder.Services.AddScoped<PhieuMuonDAL.IPhieuMuonRepository, PhieuMuonDAL.PhieuMuonRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();