using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

// Request model cho ThemSach — nhận từ [FromForm]
public class ThemSachRequest
{
    public string TieuDe { get; set; }
    public string TacGia { get; set; }
    public string NamXB { get; set; }
    public string NgonNgu { get; set; }
    public int SoLuongSach { get; set; }

    // File ảnh upload
    public IFormFile? HinhAnh { get; set; }

    // Danh sách mã thể loại: gửi nhiều field "DanhSachTheLoai" hoặc "DanhSachTheLoai[]"
    public List<string> DanhSachTheLoai { get; set; } = new();
}

// Request model cho SuaSach — nhận từ [FromForm]
public class SuaSachRequest
{
    public string TieuDe { get; set; }
    public string TacGia { get; set; }
    public string NamXB { get; set; }
    public string NgonNgu { get; set; }
    public int SoLuongSach { get; set; }

    // File ảnh mới (nếu có)
    public IFormFile? HinhAnh { get; set; }

    // Đường dẫn ảnh cũ (giữ lại nếu không upload ảnh mới)
    public string? HinhAnhCu { get; set; }

    // Danh sách mã thể loại mới
    public List<string> DanhSachTheLoai { get; set; } = new();
}
