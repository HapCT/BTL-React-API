using QuanLyThueSach.BLL;
using QuanLyThueSach.DAL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// BLL
builder.Services.AddScoped<BanDocBLL.IBanDocServices, BanDocBLL.BanDocService>();

// DAL
builder.Services.AddScoped<BanDocDAL.IBanDocRespository, BanDocDAL.BanDocResponsive>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();