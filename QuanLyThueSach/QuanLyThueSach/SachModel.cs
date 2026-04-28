using Microsoft.AspNetCore.Http;

public class ThemSachRequest
{
    public string TieuDe { get; set; }
    public string TacGia { get; set; }
    public string NamXB { get; set; }
    public string NgonNgu { get; set; }
    public int SoLuongSach { get; set; }
    public IFormFile HinhAnh { get; set; }

    public List<string> TheLoai { get; set; }
}
public class SuaSachRequest
{
    public string MaSach { get; set; }

    public string TieuDe { get; set; }
    public string TacGia { get; set; }
    public string NamXB { get; set; }
    public string NgonNgu { get; set; }
    public int SoLuongSach { get; set; }

    public IFormFile HinhAnh { get; set; }
    public string HinhAnhCu { get; set; }

    public List<string> TheLoai { get; set; }
}