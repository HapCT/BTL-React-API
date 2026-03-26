using Microsoft.AspNetCore.Http;

public class ThemSachRequest
{
    public string MaTheLoai { get; set; }
    public string TieuDe { get; set; }
    public string TacGia { get; set; }
    public string NamXB { get; set; }
    public string NgonNgu { get; set; }
    public int SoLuongSach { get; set; }
    public IFormFile? HinhAnh { get; set; } 
}
public class SuaSachRequest
{
    public string MaTheLoai { get; set; }
    public string TieuDe { get; set; }
    public string TacGia { get; set; }
    public string NamXB { get; set; }
    public string NgonNgu { get; set; }
    public int SoLuongSach { get; set; }

    public IFormFile? HinhAnh { get; set; } // ảnh mới
    public string? HinhAnhCu { get; set; }  // giữ ảnh cũ
}