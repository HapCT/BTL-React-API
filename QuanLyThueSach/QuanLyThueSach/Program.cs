using QuanLyThueSach.BLL;
using QuanLyThueSach.DAL;
using QuanLyThueSach.Services;
using static QuanLyThueSach.BLL.BanSaoBLL;
using static QuanLyThueSach.BLL.KeSachBLL;
using static QuanLyThueSach.DAL.BanSaoDAL;
using static QuanLyThueSach.DAL.KeSachDAL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

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
//Đặt chỗ
builder.Services.AddScoped<DatChoBLL.IDatChoServices, DatChoBLL.DatChoService>();
builder.Services.AddScoped<DatChoDAL.IDatChoRepository, DatChoDAL.DatChoRepository>();
builder.Services.AddHostedService<DatChoBackgroundService>();
// Phạt
builder.Services.AddScoped<PhatBLL.IPhatServices, PhatBLL.PhatService>();
builder.Services.AddScoped<PhatDAL.IPhatRepository, PhatDAL.PhatRepository>();
//Thanh toán
builder.Services.AddScoped<ThanhToanBLL.IThanhToanServices, ThanhToanBLL.ThanhToanService>();
builder.Services.AddScoped<ThanhToanDAL.IThanhToanRepository, ThanhToanDAL.ThanhToanRepository>();
builder.Services.AddScoped<HoaDonNhapDAL.IHoaDonNhapRepository, HoaDonNhapDAL.HoaDonNhapRepository>();
builder.Services.AddScoped<HoaDonNhapBLL.IHoaDonNhapServices, HoaDonNhapBLL.HoaDonNhapService>();
builder.Services.AddEndpointsApiExplorer();

// Swagger với JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Nhập: Bearer {token}"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();