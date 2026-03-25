CREATE DATABASE QuanLyThuVien_React; 
GO
USE QuanLyThuVien_React
GO 

CREATE TABLE BanDoc
(
	MaBanDoc NVARCHAR(20) PRIMARY KEY,
	SoThe NVARCHAR(20),
	HoTen NVARCHAR(50), 
	Email NVARCHAR(100) CHECK (Email LIKE '%_@_%._%'),
	SoDienThoai NVARCHAR(10),
	HanThe DATE,
	TrangThaiThe NVARCHAR(20),
	CHECK (TrangThaiThe IN (N'Hoạt động', N'Bị Khoá', N'Hết hạn', N'Ngừng sử dụng')),
	DuNo DECIMAL, 
	CCCD CHAR(12) NOT NULL UNIQUE,
	CHECK (
		LEN(CCCD) = 12
		AND CCCD LIKE '0%'
		AND CCCD NOT LIKE '%[^0-9]%'
	)
)
GO
CREATE TABLE TaiKhoan
(
	TenTaiKhoan NVARCHAR(20) PRIMARY KEY,
	MatKhau NVARCHAR(255),
	VaiTro NVARCHAR(20)
	CHECK (VaiTro IN (N'Admin', N'Thủ thư', N'Độc giả')),
	MaBanDoc NVARCHAR(20),
	FOREIGN KEY (MaBanDoc) REFERENCES BanDoc(MaBanDoc)
)
GO
CREATE TABLE TheLoai
(
	MaTheLoai NVARCHAR(20) PRIMARY KEY,
	TenTheLoai NVARCHAR(50),
	MoTa NVARCHAR(MAX)
)
GO
CREATE TABLE Sach
(
	MaSach NVARCHAR(20) PRIMARY KEY,
	TieuDe NVARCHAR(50),
	TacGia NVARCHAR(20),
	MaTheLoai NVARCHAR(20),
	NamXB NVARCHAR(10),
	NgonNgu NVARCHAR(20),
	SoLuongSach INT,
	HinhAnh NVARCHAR(255),
	FOREIGN KEY (MaTheLoai) REFERENCES TheLoai(MaTheLoai)
)	

GO 
CREATE TABLE KeSach
(
	MaKe NVARCHAR(20) PRIMARY KEY,
	TenKe NVARCHAR(100),
	ViTri NVARCHAR(10)
)

GO 
CREATE TABLE BanSao
(
	MaBanSao NVARCHAR(20) PRIMARY KEY,
	MaSach NVARCHAR(20),
	MaKe NVARCHAR(20),
	TrangThai NVARCHAR(20),
	CHECK( TrangThai IN (N'Trong kho', N'Đang mượn', N'Hỏng', N'Thanh lý')),
	FOREIGN KEY (MaSach) REFERENCES Sach(MaSach),
	FOREIGN KEY (MaKe) REFERENCES KeSach(MaKe)
)
GO
CREATE TABLE PhieuMuon
(
	MaPhieuMuon NVARCHAR(20) PRIMARY KEY,
	MaBanDoc NVARCHAR(20),
	MaBanSao NVARCHAR(20), -- thêm lại
	NgayMuon DATE, 
	HanTra DATE, 
	SoLanGiaHan INT, 
	TrangThai NVARCHAR(20),

	CHECK (TrangThai IN (
		N'Đăng ký mượn',
		N'Đã nhận sách',
		N'Đã trả',
		N'Quá hạn',
		N'Huỷ'
	)),

	FOREIGN KEY (MaBanDoc) REFERENCES BanDoc(MaBanDoc),
	FOREIGN KEY (MaBanSao) REFERENCES BanSao(MaBanSao)
)
GO

GO
CREATE TABLE DatCho
(
	MaDatCho NVARCHAR(20) PRIMARY KEY,
	MaSach NVARCHAR(20),
	MaBanDoc NVARCHAR(20),
	ThoiGianGiuCho DATE,
	TrangThai NVARCHAR(20) DEFAULT N'Đang chờ',
	ThuTu INT,
	FOREIGN KEY (MaSach) REFERENCES Sach(MaSach),
	FOREIGN KEY (MaBanDoc) REFERENCES BanDoc(MaBanDoc)
)

GO
CREATE TABLE Phat
(
	MaPhat NVARCHAR(20) PRIMARY KEY,
	MaPhieuMuon NVARCHAR(20),
	SoTien DECIMAL,
	LyDoPhat NVARCHAR(MAX),
	NgayTinh DATE, 
	TrangThai NVARCHAR(15),
	CHECK (TrangThai IN (N'Chưa thanh toán', N'Đã thanh toán', N'Đã huỷ')),
	FOREIGN KEY (MaPhieuMuon) REFERENCES PhieuMuon(MaPhieuMuon)
)
GO
CREATE TABLE ThanhToan
(
	MaThanhToan NVARCHAR(20) PRIMARY KEY,
	MaBanDoc NVARCHAR(20),
	NgayThanhToan DATE,
	SoTien DECIMAL, 
	HinhThucThanhToan NVARCHAR(15),
	CHECK(HinhThucThanhToan IN (N'Tiền mặt', N'Chuyển khoản')),
	GhiChu NVARCHAR(MAX),
	FOREIGN KEY (MaBanDoc) REFERENCES BanDoc(MaBanDoc)
)
ALTER TABLE ThanhToan
ADD TrangThai NVARCHAR(20)
DEFAULT N'Đã thanh toán'