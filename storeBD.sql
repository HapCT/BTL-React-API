USE QuanLyThuVien_React

-- Bạn đọc 

--Hiện bạn đọc 
CREATE PROCEDURE sp_HienBanDoc
AS
BEGIN
	SELECT 
	MaBanDoc,
	SoThe,
	HoTen,
	Email,
	SoDienThoai,
	HanThe,
	TrangThaiThe,
	DuNo,
	CCCD 
	FROM BanDoc
END
INSERT INTO TaiKhoan
(
    TenTaiKhoan,
    MatKhau,
    VaiTro,
    MaBanDoc
)
VALUES
(
    'admin',
    'admin123',
    N'Admin',
    NULL
)
--Thêm bạn đọc
CREATE OR ALTER PROCEDURE sp_ThemBanDoc
	@HoTen NVARCHAR(50), 
	@Email NVARCHAR(100),
	@SoDienThoai NVARCHAR(10),
	@HanThe DATE, 
	@CCCD CHAR(12)
AS
BEGIN 

	DECLARE @MaBanDoc NVARCHAR(20)
	DECLARE @SoThe NVARCHAR(20)

	-- tạo mã bạn đọc
	SELECT @MaBanDoc = 
	'BD' + RIGHT('000' + 
	CAST(ISNULL(MAX(CAST(SUBSTRING(MaBanDoc,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
	FROM BanDoc

	-- tạo số thẻ
	SELECT @SoThe = 
	'ST' + RIGHT('000' + 
	CAST(ISNULL(MAX(CAST(SUBSTRING(SoThe,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
	FROM BanDoc

	-- kiểm tra CCCD
	IF EXISTS (SELECT 1 FROM BanDoc WHERE CCCD = @CCCD)
	BEGIN
		PRINT N'CCCD đã tồn tại'
		RETURN
	END

	INSERT INTO BanDoc (    
	MaBanDoc,
    SoThe,
    HoTen,
    Email,
    SoDienThoai,
    HanThe,
    TrangThaiThe,
    DuNo,
    CCCD)
	VALUES (@MaBanDoc, @SoThe, @HoTen, @Email, @SoDienThoai, @HanThe, N'Hoạt động', 0, @CCCD)

END
SELECT * FROM BanDoc
-- Sửa bạn đọc 
CREATE PROCEDURE sp_SuaBanDoc
	@MaBanDoc NVARCHAR(20),
	@HoTen NVARCHAR(50),
	@Email NVARCHAR(100),
	@SoDienThoai NVARCHAR(10),
	@HanThe DATE,
	@TrangThaiThe NVARCHAR(20),
	@DuNo DECIMAL(10,2),
	@CCCD CHAR(12)
AS
BEGIN

	-- kiểm tra CCCD trùng
	IF EXISTS (SELECT 1 FROM BanDoc WHERE CCCD = @CCCD AND MaBanDoc <> @MaBanDoc)
	BEGIN
		PRINT N'CCCD đã tồn tại'
		RETURN
	END

	UPDATE BanDoc
	SET
		HoTen = @HoTen,
		Email = @Email,
		SoDienThoai = @SoDienThoai,
		HanThe = @HanThe,
		TrangThaiThe = @TrangThaiThe,
		CCCD = @CCCD
	WHERE MaBanDoc = @MaBanDoc

END
GO

-- Xoá bạn đọc 
CREATE OR ALTER PROCEDURE sp_XoaBanDoc
	@MaBanDoc NVARCHAR(20)
AS
BEGIN

	-- kiểm tra còn sách chưa trả
	IF EXISTS (
		SELECT 1 
		FROM PhieuMuon 
		WHERE MaBanDoc = @MaBanDoc 
		AND TrangThai <> N'Đã trả'
	)
	BEGIN
		PRINT N'Bạn đọc vẫn còn sách chưa trả'
		RETURN
	END

	-- kiểm tra dư nợ
	IF EXISTS (
		SELECT 1 
		FROM BanDoc
		WHERE MaBanDoc = @MaBanDoc
		AND DuNo > 0
	)
	BEGIN
		PRINT N'Bạn đọc vẫn còn dư nợ'
		RETURN
	END

	-- xoá tài khoản trước
	DELETE FROM TaiKhoan
	WHERE MaBanDoc = @MaBanDoc

	-- xoá bạn đọc
	DELETE FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc

	PRINT N'Xoá bạn đọc thành công'

END
GO
GO

-- Tìm kiếm theo id 
CREATE PROCEDURE sp_TimBanDocTheoID
	@MaBanDoc NVARCHAR(20)
AS
BEGIN

	SELECT MaBanDoc,
		SoThe,
		HoTen,
		SoDienThoai,
		Email,
		HanThe,
		TrangThaiThe,
		DuNo,
		CCCD
	FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc

END
GO

--Tìm kiếm bằng phần tử bất kì 
CREATE PROCEDURE sp_TimBanDoc
	@TuKhoa NVARCHAR(50)
AS
BEGIN

	SELECT *
	FROM BanDoc
	WHERE 
		HoTen LIKE '%' + @TuKhoa + '%'
		OR SoThe LIKE '%' + @TuKhoa + '%'
		OR CCCD LIKE '%' + @TuKhoa + '%'
		OR SoDienThoai LIKE '%' + @TuKhoa + '%'

END
GO
SELECT * FROM BanDoc

--Tài Khoản
--Danh sách tài khoản
CREATE PROCEDURE sp_HienThiTaiKhoan
AS
BEGIN
    SELECT 
        tk.TenTaiKhoan,
        tk.MatKhau,
        tk.VaiTro,
        bd.HoTen
    FROM TaiKhoan tk
    LEFT JOIN BanDoc bd ON tk.MaBanDoc = bd.MaBanDoc
END
GO

-- Đăng ký 
CREATE OR ALTER PROCEDURE sp_TaoTaiKhoan
    @TenTaiKhoan NVARCHAR(20),
    @MatKhau NVARCHAR(255),
    @VaiTro NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenTaiKhoan = @TenTaiKhoan)
    BEGIN
        RAISERROR(N'Tên tài khoản đã tồn tại',16,1)
        RETURN
    END

    INSERT INTO TaiKhoan
    (
        TenTaiKhoan,
        MatKhau,
        VaiTro
    )
    VALUES
    (
        @TenTaiKhoan,
        @MatKhau,
        @VaiTro
    )
END
CREATE OR ALTER PROCEDURE sp_DangKy
    @TenTaiKhoan NVARCHAR(20),
    @MatKhau NVARCHAR(255),
    @HoTen NVARCHAR(100),
    @CCCD NVARCHAR(12),
    @SoDienThoai NVARCHAR(15),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- kiểm tra trùng tài khoản
    IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenTaiKhoan = @TenTaiKhoan)
    BEGIN
        RAISERROR(N'Tên tài khoản đã tồn tại',16,1)
        RETURN
    END

    DECLARE @MaBanDoc NVARCHAR(20)

    -- kiểm tra CCCD đã có chưa
    SELECT @MaBanDoc = MaBanDoc
    FROM BanDoc
    WHERE CCCD = @CCCD

    -- nếu CCCD đã tồn tại → chỉ tạo tài khoản
    IF @MaBanDoc IS NOT NULL
    BEGIN
        INSERT INTO TaiKhoan
        (
            TenTaiKhoan,
            MatKhau,
            VaiTro,
            MaBanDoc
        )
        VALUES
        (
            @TenTaiKhoan,
            @MatKhau,
            N'Độc giả',
            @MaBanDoc
        )
        RETURN
    END

    -- tạo mã bạn đọc
    SELECT @MaBanDoc = 'BD' + RIGHT('000' +
        CAST(ISNULL(MAX(CAST(SUBSTRING(MaBanDoc,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
    FROM BanDoc

    DECLARE @SoThe NVARCHAR(20)

    -- tạo số thẻ
    SELECT @SoThe = 'ST' + RIGHT('000' +
        CAST(ISNULL(MAX(CAST(SUBSTRING(SoThe,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
    FROM BanDoc

    -- thêm bạn đọc
    INSERT INTO BanDoc
    (
        MaBanDoc,
        SoThe,
        HoTen,
        CCCD,
        SoDienThoai,
        Email
    )
    VALUES
    (
        @MaBanDoc,
        @SoThe,
        @HoTen,
        @CCCD,
        @SoDienThoai,
        @Email
    )

    -- tạo tài khoản
    INSERT INTO TaiKhoan
    (
        TenTaiKhoan,
        MatKhau,
        VaiTro,
        MaBanDoc
    )
    VALUES
    (
        @TenTaiKhoan,
        @MatKhau,
        N'Độc giả',
        @MaBanDoc
    )
END
GO 

ALTER PROCEDURE sp_DangNhap
    @TenTaiKhoan NVARCHAR(50),
    @MatKhau NVARCHAR(255)
AS
BEGIN
    SELECT 
        TenTaiKhoan,
        MatKhau,
        VaiTro,
        MaBanDoc
    FROM TaiKhoan
    WHERE TenTaiKhoan = @TenTaiKhoan
END
GO
GO 
CREATE PROCEDURE sp_DoiMatKhau
    @TenTaiKhoan NVARCHAR(20),
    @MatKhauCu NVARCHAR(255),
    @MatKhauMoi NVARCHAR(255)
AS
BEGIN

    -- kiểm tra mật khẩu cũ
    IF NOT EXISTS
    (
        SELECT 1
        FROM TaiKhoan
        WHERE TenTaiKhoan = @TenTaiKhoan
        AND MatKhau = @MatKhauCu
    )
    BEGIN
        PRINT N'Mật khẩu cũ không đúng'
        RETURN
    END

    -- cập nhật mật khẩu mới
    UPDATE TaiKhoan
    SET MatKhau = @MatKhauMoi
    WHERE TenTaiKhoan = @TenTaiKhoan

END
GO 
--Tìm tài khoản
CREATE PROCEDURE sp_TimTaiKhoan
	@TenTaiKhoan NVARCHAR(20)
AS
BEGIN

	SELECT *
	FROM TaiKhoan
	WHERE TenTaiKhoan = @TenTaiKhoan

END
GO
EXEC sp_XoaBanDoc @MaBanDoc = 'ST002'
--Xoá tài khoản
CREATE PROCEDURE sp_XoaTaiKhoan
    @TenTaiKhoan NVARCHAR(20)
AS
BEGIN

    DECLARE @MaBanDoc NVARCHAR(20)

    -- tìm MaBanDoc từ tài khoản
    SELECT @MaBanDoc = MaBanDoc
    FROM TaiKhoan
    WHERE TenTaiKhoan = @TenTaiKhoan

    -- kiểm tra còn sách chưa trả
    IF EXISTS (
        SELECT 1
        FROM PhieuMuon
        WHERE MaBanDoc = @MaBanDoc
        AND TrangThai <> N'Đã trả'
    )
    BEGIN
        PRINT N'Tài khoản vẫn còn sách chưa trả'
        RETURN
    END

    -- kiểm tra dư nợ
    IF EXISTS (
        SELECT 1
        FROM BanDoc
        WHERE MaBanDoc = @MaBanDoc
        AND DuNo > 0
    )
    BEGIN
        PRINT N'Tài khoản vẫn còn dư nợ'
        RETURN
    END

    DELETE FROM TaiKhoan
    WHERE TenTaiKhoan = @TenTaiKhoan

END
GO

--Thể loại
--Hiển thị thể loại
CREATE PROCEDURE sp_HienThiTheLoai
AS
BEGIN
    SELECT 
        MaTheLoai,
		TenTheLoai,
		MoTa
    FROM TheLoai
END
GO
CREATE PROCEDURE sp_ThemTheLoai
	@TenTheLoai NVARCHAR(20), 
	@MoTa NVARCHAR(MAX)
AS
BEGIN 

	DECLARE @MaTheLoai NVARCHAR(20)

	-- tạo mã thể loại
	SELECT @MaTheLoai = 
	'TL' + RIGHT('000' + 
	CAST(ISNULL(MAX(CAST(SUBSTRING(MaTheLoai,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
	FROM TheLoai
	IF EXISTS (SELECT 1 FROM TheLoai WHERE TenTheLoai = @TenTheLoai)
	BEGIN
		PRINT N'Thể loại đã tồn tại'
		RETURN
	END

	INSERT INTO TheLoai 
	VALUES (@MaTheLoai, @TenTheLoai, @MoTa)
END

--Sửa thể loại
CREATE OR ALTER PROCEDURE sp_SuaTheLoai
	@MaTheLoai NVARCHAR(20),
	@TenTheLoai NVARCHAR(50),
	@MoTa NVARCHAR(MAX)
AS
BEGIN
	IF EXISTS (
        SELECT 1 
        FROM TheLoai 
        WHERE TenTheLoai = @TenTheLoai
        AND MaTheLoai != @MaTheLoai
    )
    BEGIN
        PRINT N'Thể loại đã tồn tại'
        RETURN
    END
	UPDATE TheLoai
	SET
		TenTheLoai = @TenTheLoai,
		MoTa = @MoTa
	WHERE MaTheLoai = @MaTheLoai
END
GO
--Xoá thể loại
CREATE OR ALTER PROCEDURE sp_XoaTheLoai
	@MaTheLoai NVARCHAR(20)
AS
BEGIN
	-- kiểm tra còn sách chưa trả
	IF EXISTS (
		SELECT 1 
		FROM Sach 
		WHERE MaTheLoai = @MaTheLoai
	)
	BEGIN
		PRINT N'Trong thể loại có sách'
		RETURN
	END
	-- xoá bạn đọc
	DELETE FROM TheLoai
	WHERE MaTheLoai = @MaTheLoai

	PRINT N'Xoá thể loại thành công'

END
GO	

-- Tìm thể loại theo ID
CREATE PROCEDURE sp_TimTheLoaiTheoID
	@MaTheLoai NVARCHAR(20)
AS
BEGIN

	SELECT MaTheLoai,
	TenTheLoai,
	Mota
	FROM TheLoai
	WHERE MaTheLoai = @MaTheLoai
END
GO
-- Tìm thể loại bằng 1 thứ bất kì 
CREATE PROCEDURE sp_TimTheLoai
	@TuKhoa NVARCHAR(50)
AS
BEGIN

	SELECT *
	FROM TheLoai
	WHERE 
		TenTheLoai LIKE '%' + @TuKhoa + '%'
		OR MoTa LIKE '%' + @TuKhoa + '%'
END
EXEC sp_HienThiSach
--Sách 
IF OBJECT_ID('sp_HienThiSach', 'P') IS NOT NULL DROP PROC sp_HienThiSach;
GO
CREATE PROCEDURE sp_HienThiSach
AS
BEGIN
    SET NOCOUNT ON;
 
    SELECT
        s.MaSach,
        s.TieuDe,
        s.TacGia,
        s.NamXB,
        s.NgonNgu,
        s.SoLuongSach,
        s.HinhAnh,
        -- Ghép tên thể loại thành chuỗi "TL001:Văn học,TL002:Khoa học"
        STUFF((
            SELECT ',' + stl2.MaTheLoai + ':' + tl2.TenTheLoai
            FROM SachTheLoai stl2
            JOIN TheLoai tl2 ON stl2.MaTheLoai = tl2.MaTheLoai
            WHERE stl2.MaSach = s.MaSach
            FOR XML PATH(''), TYPE
        ).value('.','NVARCHAR(MAX)'), 1, 1, '') AS DanhSachTheLoai
    FROM Sach s
    ORDER BY s.MaSach;
END
GO

--Thêm sách
IF OBJECT_ID('sp_ThemSach', 'P') IS NOT NULL DROP PROC sp_ThemSach;
GO
CREATE PROCEDURE sp_ThemSach
    @DanhSachTheLoai    NVARCHAR(MAX),
    @TieuDe             NVARCHAR(50),
    @TacGia             NVARCHAR(20),
    @NamXB              NVARCHAR(10),
    @NgonNgu            NVARCHAR(20),
    @SoLuongSach        INT,
    @HinhAnh            NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
 
    -- Tạo mã sách mới tự tăng
    DECLARE @MaSach NVARCHAR(20);
    DECLARE @MaxNum INT;
 
    SELECT @MaxNum = ISNULL(MAX(CAST(SUBSTRING(MaSach, 2, LEN(MaSach)) AS INT)), 0)
    FROM Sach
    WHERE MaSach LIKE 'S%' AND ISNUMERIC(SUBSTRING(MaSach, 2, LEN(MaSach))) = 1;
 
    SET @MaSach = 'S' + RIGHT('000' + CAST(@MaxNum + 1 AS NVARCHAR), 3);
 
    -- Thêm sách
    INSERT INTO Sach (MaSach, TieuDe, TacGia, NamXB, NgonNgu, SoLuongSach, HinhAnh)
    VALUES (@MaSach, @TieuDe, @TacGia, @NamXB, @NgonNgu, @SoLuongSach, @HinhAnh);
 
    -- Thêm quan hệ thể loại (tách chuỗi "TL001,TL002")
    IF @DanhSachTheLoai IS NOT NULL AND LEN(TRIM(@DanhSachTheLoai)) > 0
    BEGIN
        ;WITH Split AS (
            SELECT TRIM(value) AS MaTheLoai
            FROM STRING_SPLIT(@DanhSachTheLoai, ',')
            WHERE TRIM(value) <> ''
        )
        INSERT INTO SachTheLoai (MaSach, MaTheLoai)
        SELECT @MaSach, MaTheLoai
        FROM Split
        WHERE EXISTS (SELECT 1 FROM TheLoai WHERE MaTheLoai = Split.MaTheLoai);
    END
 
    COMMIT;
END
GO
-- Sửa sách
IF OBJECT_ID('sp_SuaSach', 'P') IS NOT NULL DROP PROC sp_SuaSach;
GO
CREATE PROCEDURE sp_SuaSach
    @MaSach             NVARCHAR(20),
    @TieuDe             NVARCHAR(50),
    @TacGia             NVARCHAR(20),
    @NamXB              NVARCHAR(10),
    @NgonNgu            NVARCHAR(20),
    @SoLuongSach        INT,
    @HinhAnh            NVARCHAR(255) = NULL,
    @DanhSachTheLoai    NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
 
    -- Cập nhật thông tin sách
    UPDATE Sach
    SET TieuDe       = @TieuDe,
        TacGia       = @TacGia,
        NamXB        = @NamXB,
        NgonNgu      = @NgonNgu,
        SoLuongSach  = @SoLuongSach,
        HinhAnh      = CASE WHEN @HinhAnh IS NOT NULL THEN @HinhAnh ELSE HinhAnh END
    WHERE MaSach = @MaSach;
 
    -- Xóa toàn bộ thể loại cũ
    DELETE FROM SachTheLoai WHERE MaSach = @MaSach;
 
    -- Thêm thể loại mới
    IF @DanhSachTheLoai IS NOT NULL AND LEN(TRIM(@DanhSachTheLoai)) > 0
    BEGIN
        ;WITH Split AS (
            SELECT TRIM(value) AS MaTheLoai
            FROM STRING_SPLIT(@DanhSachTheLoai, ',')
            WHERE TRIM(value) <> ''
        )
        INSERT INTO SachTheLoai (MaSach, MaTheLoai)
        SELECT @MaSach, MaTheLoai
        FROM Split
        WHERE EXISTS (SELECT 1 FROM TheLoai WHERE MaTheLoai = Split.MaTheLoai);
    END
 
    COMMIT;
END

-- Xoá sách
CREATE OR ALTER PROCEDURE sp_XoaSach
    @MaSach NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- ❗ 1. đang mượn
    IF EXISTS (
        SELECT 1
        FROM PhieuMuon pm
        JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
        WHERE bs.MaSach = @MaSach
        AND pm.TrangThai IN (N'Đã nhận sách')
    )
    BEGIN
        RAISERROR(N'Sách đang được mượn, không thể xoá', 16, 1)
        RETURN
    END

    -- ❗ 2. chưa thanh toán
    IF EXISTS (
        SELECT 1
        FROM Phat p
        JOIN PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
        JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
        WHERE bs.MaSach = @MaSach
        AND p.TrangThai = N'Chưa thanh toán'
    )
    BEGIN
        RAISERROR(N'Sách có phiếu phạt chưa thanh toán, không thể xoá', 16, 1)
        RETURN
    END

    -- 🔥 1. Phat
    DELETE p
    FROM Phat p
    JOIN PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
    JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
    WHERE bs.MaSach = @MaSach

    -- 🔥 2. PhieuMuon
    DELETE pm
    FROM PhieuMuon pm
    JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
    WHERE bs.MaSach = @MaSach

    -- 🔥 3. DatCho (QUAN TRỌNG)
    DELETE FROM DatCho
    WHERE MaSach = @MaSach

    -- 🔥 4. BanSao
    DELETE FROM BanSao
    WHERE MaSach = @MaSach

    -- 🔥 5. Sach
    DELETE FROM Sach
    WHERE MaSach = @MaSach

    PRINT N'Xóa sách thành công'
END
GO
SELECT 'Tables:' AS Info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('Sach','TheLoai','SachTheLoai')
ORDER BY TABLE_NAME;
 
SELECT 'Columns of Sach:' AS Info;
SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Sach' ORDER BY ORDINAL_POSITION;
 
SELECT 'Stored Procedures:' AS Info;
SELECT name FROM sys.objects 
WHERE type = 'P' AND name IN ('sp_HienThiSach','sp_ThemSach','sp_SuaSach','sp_XoaSach','sp_TimSach','sp_TimSachTheoID')
ORDER BY name;
 
PRINT '=== DONE: Database đã cập nhật thành công ===';
GO

IF OBJECT_ID('sp_TimSach', 'P') IS NOT NULL DROP PROC sp_TimSach;
GO
CREATE PROCEDURE sp_TimSach
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
 
    SELECT
        s.MaSach,
        s.TieuDe,
        s.TacGia,
        s.NamXB,
        s.NgonNgu,
        s.SoLuongSach,
        s.HinhAnh,
        STUFF((
            SELECT ',' + stl2.MaTheLoai + ':' + tl2.TenTheLoai
            FROM SachTheLoai stl2
            JOIN TheLoai tl2 ON stl2.MaTheLoai = tl2.MaTheLoai
            WHERE stl2.MaSach = s.MaSach
            FOR XML PATH(''), TYPE
        ).value('.','NVARCHAR(MAX)'), 1, 1, '') AS DanhSachTheLoai
    FROM Sach s
    WHERE s.TieuDe  LIKE N'%' + @TuKhoa + '%'
       OR s.TacGia  LIKE N'%' + @TuKhoa + '%'
    ORDER BY s.MaSach;
END
GO

-- Tìm theo từ khoá 
IF OBJECT_ID('sp_TimSachTheoID', 'P') IS NOT NULL DROP PROC sp_TimSachTheoID;
GO
CREATE PROCEDURE sp_TimSachTheoID
    @MaSach NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
 
    SELECT
        s.MaSach,
        s.TieuDe,
        s.TacGia,
        s.NamXB,
        s.NgonNgu,
        s.SoLuongSach,
        s.HinhAnh,
        STUFF((
            SELECT ',' + stl2.MaTheLoai + ':' + tl2.TenTheLoai
            FROM SachTheLoai stl2
            JOIN TheLoai tl2 ON stl2.MaTheLoai = tl2.MaTheLoai
            WHERE stl2.MaSach = s.MaSach
            FOR XML PATH(''), TYPE
        ).value('.','NVARCHAR(MAX)'), 1, 1, '') AS DanhSachTheLoai
    FROM Sach s
    WHERE s.MaSach = @MaSach;
END
GO
-- Giảm số lượng sách khi mượn
CREATE PROCEDURE sp_GiamSoLuongSach
	@MaSach NVARCHAR(20),
	@SoLuong INT
AS
BEGIN

	UPDATE Sach
	SET SoLuongSach = SoLuongSach - @SoLuong
	WHERE MaSach = @MaSach

END
-- Tăng khi trả
CREATE PROCEDURE sp_TangSoLuongSach
	@MaSach NVARCHAR(20),
	@SoLuong INT
AS
BEGIN

	UPDATE Sach
	SET SoLuongSach = SoLuongSach + @SoLuong
	WHERE MaSach = @MaSach

END

--Kệ sách
--Hiển thị kệ sách
CREATE PROCEDURE sp_HienThiKeSach
AS
BEGIN
	SELECT 
		MaKe,
		TenKe,
		ViTri
	FROM KeSach
END
-- Thêm kệ sách
CREATE PROCEDURE sp_ThemKeSach
	@TenKe NVARCHAR(100),
	@ViTri NVARCHAR(10)
AS
BEGIN

	-- Kiểm tra trùng tên kệ
	IF EXISTS (SELECT 1 FROM KeSach WHERE TenKe = @TenKe)
	BEGIN
		RAISERROR(N'Tên kệ đã tồn tại',16,1)
		RETURN
	END

	DECLARE @MaKe NVARCHAR(20)

	SET @MaKe = 'K' + RIGHT('000' + 
		CAST(ISNULL(
		(SELECT MAX(CAST(SUBSTRING(MaKe,2,LEN(MaKe)) AS INT)) FROM KeSach),0) + 1 AS NVARCHAR),3)

	INSERT INTO KeSach(MaKe, TenKe, ViTri)
	VALUES(@MaKe, @TenKe, @ViTri)

END

-- tìm theo ID
CREATE PROCEDURE sp_TimKeSachTheoID
	@MaKe NVARCHAR(20)
AS
BEGIN

	SELECT 
		MaKe,
		TenKe,
		ViTri
	FROM KeSach
	WHERE MaKe = @MaKe

END
--Tìm kệ
CREATE PROCEDURE sp_TimKeSach
	@TuKhoa NVARCHAR(50)
AS
BEGIN

	SELECT 
		MaKe,
		TenKe,
		ViTri
	FROM KeSach
	WHERE 
		TenKe LIKE '%' + @TuKhoa + '%'
		OR ViTri LIKE '%' + @TuKhoa + '%'

END
--Sửa kệ
CREATE PROCEDURE sp_SuaKeSach
	@MaKe NVARCHAR(20),
	@TenKe NVARCHAR(100),
	@ViTri NVARCHAR(10)
AS
BEGIN

	-- Kiểm tra trùng (trừ chính bản ghi đang sửa)
	IF EXISTS (
		SELECT 1 
		FROM KeSach 
		WHERE (TenKe = @TenKe OR ViTri = @ViTri)
		AND MaKe <> @MaKe
	)
	BEGIN
		RAISERROR(N'Tên kệ hoặc vị trí đã tồn tại',16,1)
		RETURN
	END

	UPDATE KeSach
	SET 
		TenKe = @TenKe,
		ViTri = @ViTri
	WHERE MaKe = @MaKe

END
-- Xoá kệ
CREATE PROCEDURE sp_XoaKeSach
	@MaKe NVARCHAR(20)
AS
BEGIN

	DELETE FROM KeSach
	WHERE MaKe = @MaKe

END

--Bản sao
--Hiển thị bản sao
CREATE PROCEDURE sp_HienThiBanSao
AS
BEGIN

	SELECT 
		bs.MaBanSao,
		bs.MaSach,
		s.TieuDe,
		bs.MaKe,
		k.TenKe,
		bs.TrangThai
	FROM BanSao bs
	LEFT JOIN Sach s ON bs.MaSach = s.MaSach
	LEFT JOIN KeSach k ON bs.MaKe = k.MaKe

END
--Thêm bản sao
CREATE PROCEDURE sp_ThemBanSao
	@MaSach NVARCHAR(20),
	@SoLuong INT
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @i INT = 1
	DECLARE @MaBanSao NVARCHAR(20)
	DECLARE @MaKe NVARCHAR(20)

	-- tự lấy 1 kệ
	SELECT TOP 1 @MaKe = MaKe
	FROM KeSach
	ORDER BY MaKe

	BEGIN TRAN

	WHILE @i <= @SoLuong
	BEGIN
		
		DECLARE @So INT

		SELECT @So = ISNULL(MAX(CAST(SUBSTRING(MaBanSao,3,LEN(MaBanSao)) AS INT)),0) + 1
		FROM BanSao WITH (UPDLOCK)

		SET @MaBanSao = 'BS' + RIGHT('0000' + CAST(@So AS NVARCHAR),4)

		INSERT INTO BanSao(MaBanSao, MaSach, MaKe, TrangThai)
		VALUES(@MaBanSao, @MaSach, @MaKe, N'Trong kho')

		SET @i = @i + 1
	END

	COMMIT TRAN
END

-- Tìm bản sao theo ID
CREATE PROCEDURE sp_TimBanSaoTheoID
	@MaBanSao NVARCHAR(20)
AS
BEGIN
	SELECT 
		bs.MaBanSao,
		bs.MaSach,
		s.TieuDe,
		bs.MaKe,
		k.TenKe,
		bs.TrangThai
	FROM BanSao bs
	LEFT JOIN Sach s ON bs.MaSach = s.MaSach
	LEFT JOIN KeSach k ON bs.MaKe = k.MaKe
	WHERE bs.MaBanSao = @MaBanSao
END

-- Tìm kiếm bản sao
CREATE PROCEDURE sp_TimBanSao
	@TuKhoa NVARCHAR(50)
AS
BEGIN
	SELECT 
		bs.MaBanSao,
		bs.MaSach,
		s.TieuDe,
		bs.MaKe,
		k.TenKe,
		bs.TrangThai
	FROM BanSao bs
	LEFT JOIN Sach s ON bs.MaSach = s.MaSach
	LEFT JOIN KeSach k ON bs.MaKe = k.MaKe
	WHERE
		bs.MaBanSao LIKE '%' + @TuKhoa + '%'
		OR s.TieuDe LIKE '%' + @TuKhoa + '%'
		OR k.TenKe LIKE '%' + @TuKhoa + '%'
		OR bs.TrangThai LIKE '%' + @TuKhoa + '%'
END
-- Sửa bản sao
CREATE PROCEDURE sp_SuaBanSao
	@MaBanSao NVARCHAR(20),
	@MaSach NVARCHAR(20),
	@MaKe NVARCHAR(20),
	@TrangThai NVARCHAR(20)
AS
BEGIN
	UPDATE BanSao
	SET
		MaSach = @MaSach,
		MaKe = @MaKe,
		TrangThai = @TrangThai
	WHERE MaBanSao = @MaBanSao
END
-- Xoá bản sao
CREATE TYPE BanSaoIDList AS TABLE
(
    MaBanSao NVARCHAR(20)
)
CREATE PROCEDURE sp_XoaNhieuBanSao
    @DanhSachID BanSaoIDList READONLY
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 
        FROM BanSao bs
        JOIN @DanhSachID ds ON bs.MaBanSao = ds.MaBanSao
        WHERE bs.TrangThai = N'Đang mượn'
    )
    BEGIN
        RAISERROR(N'Có bản sao đang được mượn, không thể xoá!', 16, 1)
        RETURN
    END


    IF EXISTS (
        SELECT 1
        FROM ChiTietPhieuMuon ct
        JOIN @DanhSachID ds ON ct.MaBanSao = ds.MaBanSao
        WHERE ct.NgayTra IS NULL
    )
    BEGIN
        RAISERROR(N'Có bản sao chưa trả, không thể xoá!', 16, 1)
        RETURN
    END

    DELETE FROM BanSao
    WHERE MaBanSao IN (SELECT MaBanSao FROM @DanhSachID)

END

--Trigger 
CREATE TRIGGER trg_UpdateSoLuong
ON BanSao
AFTER INSERT, DELETE
AS
BEGIN
    UPDATE Sach
    SET SoLuongSach = (
        SELECT COUNT(*) 
        FROM BanSao 
        WHERE BanSao.MaSach = Sach.MaSach
    )
END

-- Phiếu mượn
-- Đăng ký mượn online
CREATE PROCEDURE sp_DangKyMuon
    @MaBanDoc NVARCHAR(20),
    @MaBanSao NVARCHAR(20),
    @HanTra DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaPhieuMuon NVARCHAR(20)

    BEGIN TRAN

    -- Tạo mã
    SELECT @MaPhieuMuon =
        'PM' + RIGHT('000' +
        CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
    FROM PhieuMuon WITH (UPDLOCK, HOLDLOCK)

    -- kiểm tra sách còn
    IF EXISTS (
        SELECT 1 FROM BanSao WITH (UPDLOCK, HOLDLOCK)
        WHERE MaBanSao = @MaBanSao
        AND TrangThai = N'Trong kho'
    )
    BEGIN
        INSERT INTO PhieuMuon
        VALUES
        (
            @MaPhieuMuon,
            @MaBanDoc,
            @MaBanSao,
            NULL,               -- Ngày mượn
            @HanTra,
            0,
            N'Đăng ký mượn' ,    -- trạng thái chờ duyệt
			GETDATE()
        )

        COMMIT TRAN
    END
    ELSE
    BEGIN
        ROLLBACK TRAN
        RAISERROR(N'Sách không khả dụng',16,1)
    END
END
CREATE OR ALTER PROCEDURE sp_TuDongHuyPhieuMuon
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE PhieuMuon
    SET TrangThai = N'Huỷ'
    WHERE 
        TrangThai = N'Đăng ký mượn'
        AND NgayMuon IS NULL
        AND DATEDIFF(DAY, NgayTao, GETDATE()) >= 2

    UPDATE bs
    SET TrangThai = N'Trong kho'
    FROM BanSao bs
    JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
    WHERE pm.TrangThai = N'Huỷ'
    AND bs.TrangThai = N'Đang mượn'  -- ✅ thêm điều kiện này
END
GO

-- Xem phiếu mượn theo id 
CREATE PROCEDURE sp_XemPhieuMuon
    @MaBanDoc NVARCHAR(20)
AS
BEGIN
    SELECT *
    FROM PhieuMuon
    WHERE MaBanDoc = @MaBanDoc
END
--Hiển thị 
ALTER PROCEDURE sp_HienThiPhieuMuon
AS
BEGIN
	EXEC sp_TuDongHuyPhieuMuon
	SELECT 
		pm.MaPhieuMuon,
		bd.HoTen AS TenBanDoc,
		s.TieuDe,
		pm.NgayMuon,
		pm.HanTra,
		pm.TrangThai
	FROM PhieuMuon pm
	JOIN BanDoc bd ON pm.MaBanDoc = bd.MaBanDoc
	JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
	JOIN Sach s ON bs.MaSach = s.MaSach
END

--Duyệt mượn 
CREATE OR ALTER PROCEDURE sp_DuyetMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- kiểm tra phiếu hợp lệ
        IF NOT EXISTS (
            SELECT 1 
            FROM PhieuMuon
            WHERE MaPhieuMuon = @MaPhieuMuon
            AND TrangThai = N'Đăng ký mượn'
        )
        BEGIN
            RAISERROR(N'Phiếu không hợp lệ hoặc đã được xử lý',16,1);
            ROLLBACK TRAN;
            RETURN;
        END

        -- cập nhật phiếu mượn
        UPDATE PhieuMuon
        SET 
            NgayMuon = GETDATE(),
			HanTra = DATEADD(DAY, 7, GETDATE()), 
            TrangThai = N'Đã nhận sách'
        WHERE MaPhieuMuon = @MaPhieuMuon;

        -- cập nhật bản sao (JOIN cho chắc)
        UPDATE bs
        SET TrangThai = N'Đang mượn'
        FROM BanSao bs
        JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
        WHERE pm.MaPhieuMuon = @MaPhieuMuon;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        ROLLBACK TRAN;
        THROW;
    END CATCH
END
--Tạo phiếu mượn off
CREATE OR ALTER PROCEDURE sp_TaoPhieuMuon_Offline
    @MaBanDoc NVARCHAR(20),
    @MaBanSao NVARCHAR(20),
    @NgayMuon DATE,
	@NgayTao DATE,
    @HanTra DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaPhieuMuon NVARCHAR(20);

    BEGIN TRY
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
        BEGIN TRAN;

        SELECT @MaPhieuMuon =
            'PM' + RIGHT('000' +
            CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
        FROM PhieuMuon WITH (UPDLOCK, HOLDLOCK);

        IF NOT EXISTS (
            SELECT 1 FROM BanSao
            WHERE MaBanSao = @MaBanSao
            AND TrangThai = N'Trong kho'
        )
        BEGIN
            RAISERROR(N'Sách không khả dụng',16,1);
            ROLLBACK TRAN;
            RETURN;
        END

        INSERT INTO PhieuMuon
        VALUES
        (
            @MaPhieuMuon,
            @MaBanDoc,
            @MaBanSao,
            @NgayMuon,
            @HanTra,
            0,
            N'Đã nhận sách',
			GETDATE()
        );

        UPDATE BanSao
        SET TrangThai = N'Đang mượn'
        WHERE MaBanSao = @MaBanSao;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        ROLLBACK TRAN;
        THROW;
    END CATCH
END

--Trả sách
CREATE OR ALTER PROCEDURE sp_TraSach
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    DECLARE @MaBanSao NVARCHAR(20)
    DECLARE @MaSach NVARCHAR(20)

    -- lấy MaBanSao
    SELECT @MaBanSao = MaBanSao
    FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    -- lấy MaSach từ BanSao
    SELECT @MaSach = MaSach
    FROM BanSao
    WHERE MaBanSao = @MaBanSao

    -- cập nhật phiếu
    UPDATE PhieuMuon
    SET TrangThai = N'Đã trả'
    WHERE MaPhieuMuon = @MaPhieuMuon

    -- trả sách về kho
    UPDATE BanSao
    SET TrangThai = N'Trong kho'
    WHERE MaBanSao = @MaBanSao

    EXEC sp_TuDongMuonTuDatCho @MaSach
END

--Gia hạn
CREATE PROCEDURE sp_GiaHan
    @MaPhieuMuon NVARCHAR(20),
    @SoNgayThem INT
AS
BEGIN
    UPDATE PhieuMuon
    SET 
        HanTra = DATEADD(DAY, @SoNgayThem, HanTra),
        SoLanGiaHan = SoLanGiaHan + 1
    WHERE MaPhieuMuon = @MaPhieuMuon
    AND TrangThai = N'Đã nhận sách'
END

--Kiểm tra quá hạn
CREATE PROCEDURE sp_KiemTraQuaHan
AS
BEGIN
    UPDATE PhieuMuon
    SET TrangThai = N'Quá hạn'
    WHERE HanTra < GETDATE()
    AND TrangThai = N'Đã nhận sách'
END

--Huỷ phiếu 
CREATE PROCEDURE sp_HuyPhieuMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
-- ✅ Sửa
	UPDATE PhieuMuon
	SET TrangThai = N'Huỷ'
	WHERE TrangThai = N'Đăng ký mượn'
	AND MaPhieuMuon = @MaPhieuMuon  -- ← còn thiếu cái này nữa!
END

--Xoá
CREATE PROCEDURE sp_XoaPhieuMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TrangThai NVARCHAR(50)

    -- Lấy trạng thái
    SELECT @TrangThai = TrangThai
    FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    -- Không tồn tại
    IF @TrangThai IS NULL
    BEGIN
        RAISERROR(N'Phiếu không tồn tại',16,1)
        RETURN
    END

    -- Không cho xoá nếu đã nhận sách
    IF @TrangThai NOT IN (N'Đăng ký mượn', N'Huỷ')
    BEGIN
        RAISERROR(N'Không thể xoá phiếu đã xử lý',16,1)
        RETURN
    END

    DELETE FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    PRINT N'Xoá phiếu thành công'
END
--Đặt chỗ
--đặt
CREATE SEQUENCE Seq_DatCho
START WITH 1000
INCREMENT BY 1;
SELECT NEXT VALUE FOR Seq_DatCho
UPDATE BanSao
SET TrangThai = N'Trong kho'
WHERE MaBanSao = 'BS0013'
Select * From BanSao
EXEC sp_DatCho 'BD001', 'S003'
SELECT * FROM PhieuMuon
SELECT * FROM DatCho
-- 1. kiểm tra DB
SELECT DB_NAME()

-- 2. kiểm tra sequence
SELECT * FROM sys.sequences WHERE name = 'Seq_DatCho'

-- 3. test sequence
SELECT NEXT VALUE FOR dbo.Seq_DatCho
CREATE OR ALTER PROCEDURE sp_DatCho
    @MaBanDoc NVARCHAR(20),
    @MaSach NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN

        DECLARE @MaDatCho NVARCHAR(20)
        DECLARE @ThuTu INT

        -- check trùng
        IF EXISTS (
            SELECT 1 FROM DatCho
            WHERE MaSach = @MaSach
            AND MaBanDoc = @MaBanDoc
            AND TrangThai = N'Đang chờ'
        )
        BEGIN
            RAISERROR(N'Bạn đã đặt sách này rồi',16,1)
            ROLLBACK
            RETURN
        END

        -- tính thứ tự
        SELECT @ThuTu = ISNULL(MAX(ThuTu),0) + 1
        FROM DatCho WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach = @MaSach AND TrangThai = N'Đang chờ'

        -- 🔥 FIX: gọi đúng sequence (có schema dbo)
        SET @MaDatCho = 'DC' + CAST(NEXT VALUE FOR dbo.Seq_DatCho AS NVARCHAR)

        INSERT INTO DatCho
        (
            MaDatCho,
            MaSach,
            MaBanDoc,
            ThoiGianGiuCho,
            TrangThai,
            ThuTu
        )
        VALUES
        (
            @MaDatCho,
            @MaSach,
            @MaBanDoc,
            DATEADD(DAY,2,GETDATE()),
            N'Đang chờ',
            @ThuTu
        )

        COMMIT
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE()
        RAISERROR(@ErrorMessage, 16, 1)
    END CATCH
END
--Hiển thị
CREATE PROCEDURE sp_LayDanhSachDatCho
AS
BEGIN
    SELECT 
        dc.MaDatCho,
        dc.MaSach,
        s.TieuDe,
        dc.MaBanDoc,
        bd.HoTen,
        dc.ThoiGianGiuCho,
        dc.TrangThai,
        dc.ThuTu
    FROM DatCho dc
    INNER JOIN Sach s ON dc.MaSach = s.MaSach
    INNER JOIN BanDoc bd ON dc.MaBanDoc = bd.MaBanDoc
    ORDER BY dc.MaSach, dc.ThuTu
END
-- tự động chuyển
CREATE PROCEDURE sp_TuDongMuonTuDatCho
    @MaSach NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaBanDoc NVARCHAR(20)
    DECLARE @MaBanSao NVARCHAR(20)
    DECLARE @HanTra DATE

    -- lấy người đầu hàng
    SELECT TOP 1 @MaBanDoc = MaBanDoc
    FROM DatCho
    WHERE MaSach = @MaSach
    AND TrangThai = N'Đang chờ'
    ORDER BY ThuTu

    -- lấy bản sao còn
    SELECT TOP 1 @MaBanSao = MaBanSao
    FROM BanSao
    WHERE MaSach = @MaSach
    AND TrangThai = N'Trong kho'

    IF @MaBanDoc IS NOT NULL AND @MaBanSao IS NOT NULL
    BEGIN
        -- tạo hạn trả
        SET @HanTra = DATEADD(DAY, 7, GETDATE())

        -- gọi mượn
        EXEC sp_DangKyMuon @MaBanDoc, @MaBanSao, @HanTra

        -- cập nhật đặt chỗ
        UPDATE DatCho
        SET TrangThai = N'Đã xử lý'
        WHERE MaBanDoc = @MaBanDoc
        AND MaSach = @MaSach
    END
END
-- sau khi trả sách xong

--Huỷ đặt chỗ
CREATE OR ALTER PROCEDURE sp_HuyDatCho
    @MaDatCho NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaSach NVARCHAR(20)
    DECLARE @ThuTu INT

    -- lấy thông tin
    SELECT 
        @MaSach = MaSach,
        @ThuTu = ThuTu
    FROM DatCho
    WHERE MaDatCho = @MaDatCho

    -- kiểm tra tồn tại
    IF @MaSach IS NULL
    BEGIN
        RAISERROR(N'Không tìm thấy đặt chỗ',16,1)
        RETURN
    END

    -- chỉ huỷ khi đang chờ
    IF NOT EXISTS (
        SELECT 1 FROM DatCho
        WHERE MaDatCho = @MaDatCho
        AND TrangThai = N'Đang chờ'
    )
    BEGIN
        RAISERROR(N'Không thể huỷ',16,1)
        RETURN
    END

    -- huỷ
    UPDATE DatCho
    SET TrangThai = N'Huỷ'
    WHERE MaDatCho = @MaDatCho

    -- 🔥 cập nhật lại hàng đợi
    UPDATE DatCho
    SET ThuTu = ThuTu - 1
    WHERE MaSach = @MaSach
    AND ThuTu > @ThuTu
    AND TrangThai = N'Đang chờ'
END

--TỰ động hết hạn
CREATE OR ALTER PROCEDURE sp_HetHanDatCho
AS
BEGIN
    SET NOCOUNT ON;

    -- đánh dấu hết hạn
    UPDATE DatCho
    SET TrangThai = N'Hết hạn'
    WHERE ThoiGianGiuCho < GETDATE()
    AND TrangThai = N'Đang chờ'

    -- 🔥 cập nhật lại hàng đợi
    ;WITH CTE AS (
        SELECT 
            MaDatCho,
            MaSach,
            ROW_NUMBER() OVER (PARTITION BY MaSach ORDER BY ThuTu) AS NewThuTu
        FROM DatCho
        WHERE TrangThai = N'Đang chờ'
    )
    UPDATE dc
    SET ThuTu = c.NewThuTu
    FROM DatCho dc
    JOIN CTE c ON dc.MaDatCho = c.MaDatCho
END

-- Trig
CREATE TRIGGER trg_AutoMuonTuDatCho
ON BanSao
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ xử lý khi sách chuyển từ Đang mượn → Trong kho
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN deleted d ON i.MaBanSao = d.MaBanSao
        WHERE i.TrangThai = N'Trong kho'
        AND d.TrangThai = N'Đang mượn'
    )
    BEGIN
        DECLARE @MaSach NVARCHAR(20)

        -- lấy sách vừa trả
        SELECT TOP 1 @MaSach = MaSach FROM inserted

        -- gọi SP tự động mượn
        EXEC sp_TuDongMuonTuDatCho @MaSach
    END
END

--Phạt
CREATE OR ALTER PROCEDURE spPhat
    @MaPhieuMuon NVARCHAR(20),
    @LyDoPhat NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @NgayTra DATE = GETDATE(),
        @HanTra DATE,
        @SoNgayTre INT = 0,
        @SoTien DECIMAL = 0,
        @MaPhat NVARCHAR(20),
        @MaBanDoc NVARCHAR(20)

    -- ❌ Kiểm tra tồn tại
    IF NOT EXISTS (SELECT 1 FROM PhieuMuon WHERE MaPhieuMuon = @MaPhieuMuon)
    BEGIN
        PRINT N'Phiếu mượn không tồn tại'
        RETURN
    END

    -- ❌ Không cho tạo phạt trùng
    IF EXISTS (SELECT 1 FROM Phat WHERE MaPhieuMuon = @MaPhieuMuon AND TrangThai != N'Đã huỷ')
    BEGIN
        PRINT N'Phiếu này đã có phạt'
        RETURN
    END

    -- Lấy thông tin
    SELECT 
        @HanTra = HanTra,
        @MaBanDoc = MaBanDoc
    FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    -- Tính trễ
    IF (@NgayTra > @HanTra)
        SET @SoNgayTre = DATEDIFF(DAY, @HanTra, @NgayTra)

    SET @SoTien = @SoNgayTre * 3.000

    -- Thêm lý do
    IF (@LyDoPhat LIKE N'%hỏng%')
        SET @SoTien += 50000

    IF (@LyDoPhat LIKE N'%mất%')
        SET @SoTien += 200000

    -- ❗ Nếu không có tiền phạt thì bỏ qua
    IF (@SoTien = 0)
    BEGIN
        PRINT N'Không có vi phạm'
        RETURN
    END

    -- ✅ Tạo mã bằng NEWID tránh trùng
    SET @MaPhat = 'P' + REPLACE(LEFT(NEWID(), 8), '-', '')

    -- Insert
    INSERT INTO Phat
    (
        MaPhat,
        MaPhieuMuon,
        SoTien,
        LyDoPhat,
        NgayTinh,
        TrangThai
    )
    VALUES
    (
        @MaPhat,
        @MaPhieuMuon,
        @SoTien,
        @LyDoPhat,
        @NgayTra,
        N'Chưa thanh toán'
    )

    -- Update dư nợ
    UPDATE BanDoc
    SET DuNo = ISNULL(DuNo, 0) + @SoTien
    WHERE MaBanDoc = @MaBanDoc

END
GO
GO
EXEC spPhat 
    @MaPhieuMuon = 'PM001',
    @LyDoPhat = N'Trễ hạn và hỏng sách'

-- Hiển thị
CREATE PROCEDURE sp_GetPhatFull
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.MaPhat,
        p.MaPhieuMuon,
        bd.MaBanDoc,
        bd.HoTen AS TenBanDoc,
        s.TieuDe AS TenSach,
        p.SoTien,
        p.LyDoPhat,
        p.NgayTinh,
        p.TrangThai
    FROM Phat p
    JOIN PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
    JOIN BanDoc bd ON pm.MaBanDoc = bd.MaBanDoc
    JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
    JOIN Sach s ON bs.MaSach = s.MaSach
    ORDER BY p.NgayTinh DESC
END
GO

-- TÌm
CREATE PROCEDURE sp_SearchPhat
    @Keyword NVARCHAR(100) = NULL,
    @TrangThai NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.MaPhat,
        p.MaPhieuMuon,
        bd.MaBanDoc,
        bd.HoTen AS TenBanDoc,
        s.TieuDe AS TenSach,
        p.SoTien,
        p.LyDoPhat,
        p.NgayTinh,
        p.TrangThai
    FROM Phat p
    JOIN PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
    JOIN BanDoc bd ON pm.MaBanDoc = bd.MaBanDoc
    JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
    JOIN Sach s ON bs.MaSach = s.MaSach
    WHERE
        (
            @Keyword IS NULL 
            OR p.MaPhat LIKE '%' + @Keyword + '%'
            OR bd.HoTen LIKE '%' + @Keyword + '%'
            OR s.TieuDe LIKE '%' + @Keyword + '%'
        )
        AND (@TrangThai IS NULL OR p.TrangThai = @TrangThai)
    ORDER BY p.NgayTinh DESC
END
GO


-- Huỷ 
ALTER PROCEDURE sp_HuyPhat
    @MaPhat NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @SoTien DECIMAL,
        @MaBanDoc NVARCHAR(20)

    -- lấy tiền + bạn đọc
    SELECT 
        @SoTien = p.SoTien,
        @MaBanDoc = pm.MaBanDoc
    FROM Phat p
    JOIN PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
    WHERE p.MaPhat = @MaPhat
    AND p.TrangThai = N'Chưa thanh toán'

    IF @SoTien IS NULL RETURN

    -- huỷ phạt
    UPDATE Phat
    SET TrangThai = N'Đã huỷ'
    WHERE MaPhat = @MaPhat

    -- 🔥 TRỪ LẠI DƯ NỢ
    UPDATE BanDoc
    SET DuNo = ISNULL(DuNo,0) - @SoTien
    WHERE MaBanDoc = @MaBanDoc
END
GO
EXEC sp_ThanhToanPhat 
    @MaPhieuMuon = 'PM001',
    @HinhThucThanhToan = N'Tiền mặt'
SELECT * FROM ThanhToan
CREATE OR ALTER PROCEDURE sp_ThanhToanPhat
    @MaPhieuMuon NVARCHAR(20),
    @HinhThucThanhToan NVARCHAR(15),
    @GhiChu NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRAN

    BEGIN TRY

        DECLARE 
            @MaBanDoc NVARCHAR(20),
            @NgayMuon DATE,
            @HanTra DATE,
            @TienThue DECIMAL = 0,
            @TienPhat DECIMAL = 0,
            @TongTien DECIMAL = 0,
            @GiaMotNgay DECIMAL = 1.500,
            @MaThanhToan NVARCHAR(20),
            @SoNgayMuon INT,
            @MaBanSao NVARCHAR(20)

        -- ❌ kiểm tra tồn tại
        IF NOT EXISTS (SELECT 1 FROM PhieuMuon WHERE MaPhieuMuon = @MaPhieuMuon)
        BEGIN
            RAISERROR(N'Phiếu mượn không tồn tại',16,1)
            ROLLBACK
            RETURN
        END

        -- 🔥 lấy info
        SELECT 
            @MaBanDoc = MaBanDoc,
            @NgayMuon = NgayMuon,
            @HanTra = HanTra,
            @MaBanSao = MaBanSao
        FROM PhieuMuon
        WHERE MaPhieuMuon = @MaPhieuMuon

        IF (@NgayMuon IS NULL)
        BEGIN
            RAISERROR(N'Phiếu chưa được duyệt',16,1)
            ROLLBACK
            RETURN
        END

        -- 🔥 tính tiền thuê
        SET @SoNgayMuon = DATEDIFF(DAY, @NgayMuon, GETDATE())
        IF (@SoNgayMuon <= 0) SET @SoNgayMuon = 1

        SET @TienThue = @SoNgayMuon * @GiaMotNgay

        -- 🔥 tiền phạt
        SELECT @TienPhat = ISNULL(SUM(SoTien),0)
        FROM Phat
        WHERE MaPhieuMuon = @MaPhieuMuon
        AND TrangThai = N'Chưa thanh toán'

        SET @TongTien = @TienThue + @TienPhat

        IF (@TongTien = 0)
        BEGIN
            RAISERROR(N'Không có khoản cần thanh toán',16,1)
            ROLLBACK
            RETURN
        END

        -- ✅ tạo mã thanh toán
        SET @MaThanhToan = 'TT' + REPLACE(LEFT(NEWID(), 8), '-', '')

        -- ================= 🔥 XỬ LÝ MẤT SÁCH =================
        IF EXISTS (
            SELECT 1 
            FROM Phat 
            WHERE MaPhieuMuon = @MaPhieuMuon
            AND LyDoPhat LIKE N'%mất%'
        )
        BEGIN
            -- ❗ xoá bản sao → trigger tự giảm số lượng
            DELETE FROM BanSao
            WHERE MaBanSao = @MaBanSao
        END
        ELSE
        BEGIN
            -- ❗ trả sách bình thường
            UPDATE BanSao
            SET TrangThai = N'Trong kho'
            WHERE MaBanSao = @MaBanSao
        END

        -- ================= 🔥 INSERT THANH TOÁN =================
        INSERT INTO ThanhToan
        (
            MaThanhToan,
            MaBanDoc,
            NgayThanhToan,
            SoTien,
            HinhThucThanhToan,
            GhiChu
        )
        VALUES
        (
            @MaThanhToan,
            @MaBanDoc,
            GETDATE(),
            @TongTien,
            @HinhThucThanhToan,
            @GhiChu
        )

        -- 🔥 update phạt
        UPDATE Phat
        SET TrangThai = N'Đã thanh toán'
        WHERE MaPhieuMuon = @MaPhieuMuon
        AND TrangThai = N'Chưa thanh toán'

        -- 🔥 trừ dư nợ
        UPDATE BanDoc
        SET DuNo = ISNULL(DuNo,0) - @TienPhat
        WHERE MaBanDoc = @MaBanDoc

        -- 🔥 cập nhật phiếu mượn
        UPDATE PhieuMuon
        SET TrangThai = N'Đã trả'
        WHERE MaPhieuMuon = @MaPhieuMuon

        COMMIT

        -- 🔥 trả kết quả
        SELECT 
            @MaThanhToan AS MaThanhToan,
            @TienThue AS TienThue,
            @TienPhat AS TienPhat,
            @TongTien AS TongTien

    END TRY
    BEGIN CATCH
        ROLLBACK
        DECLARE @ErrorMessage NVARCHAR(4000)
        SET @ErrorMessage = ERROR_MESSAGE()
        RAISERROR(@ErrorMessage, 16, 1)
    END CATCH
END
GO
CREATE PROCEDURE sp_GetHoaDon
    @MaThanhToan NVARCHAR(20)
AS
BEGIN
    SELECT 
        tt.MaThanhToan,
        bd.HoTen,
        bd.SoDienThoai,
        tt.NgayThanhToan,
        tt.SoTien,
        tt.HinhThucThanhToan,
        tt.GhiChu
    FROM ThanhToan tt
    JOIN BanDoc bd ON tt.MaBanDoc = bd.MaBanDoc
    WHERE tt.MaThanhToan = @MaThanhToan
END
GO

ALTER PROCEDURE sp_GetThanhToan
AS
BEGIN
    SELECT 
        tt.MaThanhToan,
        tt.MaBanDoc,
        bd.HoTen AS TenBanDoc, -- ✅ FIX Ở ĐÂY
        bd.SoDienThoai,
        tt.NgayThanhToan,
        tt.SoTien,
        tt.HinhThucThanhToan,
        tt.GhiChu,
        tt.TrangThai
    FROM ThanhToan tt
    JOIN BanDoc bd ON tt.MaBanDoc = bd.MaBanDoc
    ORDER BY tt.NgayThanhToan DESC
END
GO
ALTER PROCEDURE sp_HuyThanhToan
    @MaThanhToan NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @SoTien DECIMAL,
        @MaBanDoc NVARCHAR(20)

    SELECT 
        @SoTien = SoTien,
        @MaBanDoc = MaBanDoc
    FROM ThanhToan
    WHERE MaThanhToan = @MaThanhToan
      AND TrangThai = N'Đã thanh toán'

    IF @SoTien IS NULL RETURN

    -- Huỷ
    UPDATE ThanhToan
    SET TrangThai = N'Đã huỷ'
    WHERE MaThanhToan = @MaThanhToan

    -- 🔥 Cộng lại nợ
    UPDATE BanDoc
    SET DuNo = ISNULL(DuNo,0) + @SoTien
    WHERE MaBanDoc = @MaBanDoc
END
GO

EXEC sp_TraSach
EXEC sp_TraSach @MaPhieuMuon = 'PM001'
EXEC sp_ThanhToanPhat @MaPhat = 'P0001', @HinhThucThanhToan = N'Tiền mặt'
UPDATE Phat
SET TrangThai = N'Chưa thanh toán'
WHERE MaPhat = 'P0001'

SELECT * FROM ThanhToan

--Tính tiền 
ALTER PROCEDURE sp_TinhTien
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @NgayMuon DATE,
        @HanTra DATE,
        @SoNgayMuon INT,
        @TienThue DECIMAL = 0,
        @TienPhat DECIMAL = 0,
        @TongTien DECIMAL = 0,
        @GiaMotNgay DECIMAL = 1.500 -- 🔥 chỉnh tùy bạn

    -- lấy dữ liệu
    SELECT 
        @NgayMuon = NgayMuon,
        @HanTra = HanTra
    FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    -- ❌ nếu chưa duyệt
    IF (@NgayMuon IS NULL)
    BEGIN
        RAISERROR(N'Phiếu chưa được duyệt',16,1)
        RETURN
    END

    -- 🔥 số ngày mượn
    SET @SoNgayMuon = DATEDIFF(DAY, @NgayMuon, GETDATE())

    IF (@SoNgayMuon <= 0)
        SET @SoNgayMuon = 1

    -- 🔥 tiền thuê
    SET @TienThue = @SoNgayMuon * @GiaMotNgay

    -- 🔥 tiền phạt
    IF (GETDATE() > @HanTra)
    BEGIN
        SET @TienPhat = DATEDIFF(DAY, @HanTra, GETDATE()) * 5000
    END

    SET @TongTien = @TienThue + @TienPhat

    -- 🔥 trả dữ liệu
    SELECT 
        @TienThue AS TienThue,
        @TienPhat AS TienPhat,
        @TongTien AS TongTien
END

CREATE PROCEDURE sp_PreviewThanhToan
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @NgayMuon DATE,
        @HanTra DATE,
        @TienThue DECIMAL = 0,
        @TienPhat DECIMAL = 0,
        @TongTien DECIMAL = 0,
        @SoNgayMuon INT

    -- lấy phiếu
    SELECT 
        @NgayMuon = NgayMuon,
        @HanTra = HanTra
    FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    IF (@NgayMuon IS NULL)
    BEGIN
        RAISERROR(N'Phiếu chưa được duyệt',16,1)
        RETURN
    END

    -- tiền thuê
    SET @SoNgayMuon = DATEDIFF(DAY, @NgayMuon, GETDATE())
    IF (@SoNgayMuon <= 0) SET @SoNgayMuon = 1

    SET @TienThue = @SoNgayMuon * 5000

    -- 🔥 LẤY PHẠT TỪ BẢNG PHAT
    SELECT @TienPhat = ISNULL(SUM(SoTien),0)
    FROM Phat
    WHERE MaPhieuMuon = @MaPhieuMuon
    AND TrangThai = N'Chưa thanh toán'

    SET @TongTien = @TienThue + @TienPhat

    SELECT 
        @TienThue AS TienThue,
        @TienPhat AS TienPhat,
        @TongTien AS TongTien
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HoaDonNhap')
BEGIN
    CREATE TABLE HoaDonNhap (
        MaHoaDonNhap    NVARCHAR(20)    PRIMARY KEY,
        NhaCungCap      NVARCHAR(200)   NOT NULL,
        NguoiNhap       NVARCHAR(100)   NULL,
        NgayNhap        DATE            NOT NULL DEFAULT GETDATE(),
        TongTien        DECIMAL(18, 0)  NOT NULL DEFAULT 0,
        GhiChu          NVARCHAR(500)   NULL
    );
END
GO

-- 2. Tạo bảng ChiTietHoaDonNhap
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChiTietHoaDonNhap')
BEGIN
    CREATE TABLE ChiTietHoaDonNhap (
        ID              INT             IDENTITY(1,1) PRIMARY KEY,
        MaHoaDonNhap    NVARCHAR(20)    NOT NULL REFERENCES HoaDonNhap(MaHoaDonNhap) ON DELETE CASCADE,
        MaSach          NVARCHAR(20)    NOT NULL REFERENCES Sach(MaSach),
        SoLuong         INT             NOT NULL DEFAULT 1,
        DonGia          DECIMAL(18, 0)  NOT NULL DEFAULT 0,
        ThanhTien       DECIMAL(18, 0)  NOT NULL DEFAULT 0
    );
END
GO

-- ============================================================
-- SP: Lấy danh sách hóa đơn nhập (kèm số dòng sách)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetHoaDonNhap
AS
BEGIN
    SELECT 
        h.MaHoaDonNhap,
        h.NhaCungCap,
        h.NguoiNhap,
        h.NgayNhap,
        h.TongTien,
        h.GhiChu,
        COUNT(c.ID) AS SoSach
    FROM HoaDonNhap h
    LEFT JOIN ChiTietHoaDonNhap c ON h.MaHoaDonNhap = c.MaHoaDonNhap
    GROUP BY 
        h.MaHoaDonNhap, h.NhaCungCap, h.NguoiNhap, 
        h.NgayNhap, h.TongTien, h.GhiChu
    ORDER BY h.NgayNhap DESC;
END
GO

-- ============================================================
-- SP: Lấy chi tiết 1 hóa đơn nhập (2 result sets)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetHoaDonNhapById
    @MaHoaDonNhap NVARCHAR(20)
AS
BEGIN
    -- RS1: Header
    SELECT 
        MaHoaDonNhap, NhaCungCap, NguoiNhap, NgayNhap, TongTien, GhiChu
    FROM HoaDonNhap
    WHERE MaHoaDonNhap = @MaHoaDonNhap;

    -- RS2: Chi tiết sách
    SELECT 
        c.MaSach,
        s.TieuDe AS TenSach,
        c.SoLuong,
        c.DonGia,
        c.ThanhTien
    FROM ChiTietHoaDonNhap c
    LEFT JOIN Sach s ON c.MaSach = s.MaSach
    WHERE c.MaHoaDonNhap = @MaHoaDonNhap;
END
GO

-- ============================================================
-- SP: Thêm hóa đơn nhập (header)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_ThemHoaDonNhap
    @MaHoaDonNhap   NVARCHAR(20),
    @NhaCungCap     NVARCHAR(200),
    @NguoiNhap      NVARCHAR(100),
    @NgayNhap       DATE,
    @TongTien       DECIMAL(18, 0),
    @GhiChu         NVARCHAR(500)
AS
BEGIN
    INSERT INTO HoaDonNhap (MaHoaDonNhap, NhaCungCap, NguoiNhap, NgayNhap, TongTien, GhiChu)
    VALUES (@MaHoaDonNhap, @NhaCungCap, @NguoiNhap, @NgayNhap, @TongTien, @GhiChu);
END
GO

-- ============================================================
-- SP: Thêm chi tiết hóa đơn nhập
-- ============================================================
CREATE OR ALTER PROCEDURE sp_ThemChiTietHoaDonNhap
    @MaHoaDonNhap   NVARCHAR(20),
    @MaSach         NVARCHAR(20),
    @SoLuong        INT,
    @DonGia         DECIMAL(18, 0),
    @ThanhTien      DECIMAL(18, 0)
AS
BEGIN
    INSERT INTO ChiTietHoaDonNhap (MaHoaDonNhap, MaSach, SoLuong, DonGia, ThanhTien)
    VALUES (@MaHoaDonNhap, @MaSach, @SoLuong, @DonGia, @ThanhTien);

    -- Cập nhật SoLuongSach trong bảng Sach
    UPDATE Sach
    SET SoLuongSach = SoLuongSach + @SoLuong
    WHERE MaSach = @MaSach;
END
GO

-- ============================================================
-- SP: Sửa hóa đơn nhập (header)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_SuaHoaDonNhap
    @MaHoaDonNhap   NVARCHAR(20),
    @NhaCungCap     NVARCHAR(200),
    @NguoiNhap      NVARCHAR(100),
    @NgayNhap       DATE,
    @TongTien       DECIMAL(18, 0),
    @GhiChu         NVARCHAR(500)
AS
BEGIN
    UPDATE HoaDonNhap
    SET 
        NhaCungCap  = @NhaCungCap,
        NguoiNhap   = @NguoiNhap,
        NgayNhap    = @NgayNhap,
        TongTien    = @TongTien,
        GhiChu      = @GhiChu
    WHERE MaHoaDonNhap = @MaHoaDonNhap;
END
GO

-- ============================================================
-- SP: Xóa hóa đơn nhập (ON DELETE CASCADE tự xóa chi tiết)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_XoaHoaDonNhap
    @MaHoaDonNhap NVARCHAR(20)
AS
BEGIN
    DELETE FROM HoaDonNhap WHERE MaHoaDonNhap = @MaHoaDonNhap;
END
GO


-- PATCH: Các stored procedure và trigger còn thiếu/sai
-- ============================================================

-- FIX Bug 1: sp_XemPhieuMuonTheoBanDoc bị thiếu
-- DAL gọi SP này nhưng chưa tồn tại trong DB
-- ============================================================
CREATE OR ALTER PROCEDURE sp_XemPhieuMuonTheoBanDoc
    @MaBanDoc NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pm.MaPhieuMuon,
        bd.HoTen        AS TenBanDoc,
        s.TieuDe        AS TenSach,
        CAST(pm.NgayTao AS DATE) AS NgayTao,
        pm.NgayMuon,
        pm.HanTra,
        pm.TrangThai
    FROM PhieuMuon pm
    JOIN BanDoc  bd ON pm.MaBanDoc  = bd.MaBanDoc
    JOIN BanSao  bs ON pm.MaBanSao  = bs.MaBanSao
    JOIN Sach     s ON bs.MaSach    = s.MaSach
    WHERE pm.MaBanDoc = @MaBanDoc
    ORDER BY pm.NgayTao DESC;
END
GO

-- FIX Bug 2: sp_DangKyMuonOnline - tự chọn MaBanSao từ MaSach
-- Trước đây DAL truyền @MaSach nhưng sp_DangKyMuon nhận @MaBanSao
-- SP mới này nhận @MaSach rồi tự tìm bản sao còn trong kho
-- ============================================================
CREATE OR ALTER PROCEDURE sp_DangKyMuonOnline
    @MaBanDoc  NVARCHAR(20),
    @MaSach    NVARCHAR(20),
    @HanTra    DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaBanSao    NVARCHAR(20)
    DECLARE @MaPhieuMuon NVARCHAR(20)

    BEGIN TRY
        BEGIN TRAN

        -- Lấy một bản sao còn trong kho của sách này
        SELECT TOP 1 @MaBanSao = MaBanSao
        FROM BanSao WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach   = @MaSach
          AND TrangThai = N'Trong kho'
        ORDER BY MaBanSao

        IF @MaBanSao IS NULL
        BEGIN
            RAISERROR(N'Sách hiện không còn bản nào trong kho để mượn', 16, 1)
            ROLLBACK TRAN
            RETURN
        END

        -- Tạo mã phiếu mượn
        SELECT @MaPhieuMuon =
            'PM' + RIGHT('000' +
            CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon,3,10) AS INT)),0) + 1 AS NVARCHAR),3)
        FROM PhieuMuon WITH (UPDLOCK, HOLDLOCK)

        -- Tạo phiếu mượn ở trạng thái chờ duyệt
        INSERT INTO PhieuMuon
            (MaPhieuMuon, MaBanDoc, MaBanSao, NgayMuon, HanTra, SoLanGiaHan, TrangThai, NgayTao)
        VALUES
            (@MaPhieuMuon, @MaBanDoc, @MaBanSao, NULL, @HanTra, 0, N'Đăng ký mượn', GETDATE())

        -- Đánh dấu bản sao đã được giữ (chờ duyệt)
        UPDATE BanSao
        SET TrangThai = N'Chờ duyệt'
        WHERE MaBanSao = @MaBanSao

        COMMIT TRAN
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE()
        RAISERROR(@Err, 16, 1)
    END CATCH
END
GO

-- FIX Bug 3: Trigger trg_UpdateSoLuong chỉ chạy INSERT/DELETE,
-- không cập nhật SoLuongSach khi BanSao.TrangThai thay đổi.
-- Thay bằng trigger AFTER INSERT, UPDATE, DELETE đếm bản sao còn trong kho.
-- ============================================================
DROP TRIGGER IF EXISTS trg_UpdateSoLuong
GO

CREATE TRIGGER trg_UpdateSoLuong
ON BanSao
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Gom các MaSach bị ảnh hưởng (cả inserted lẫn deleted để cover UPDATE/DELETE)
    ;WITH AffectedSach AS (
        SELECT MaSach FROM inserted
        UNION
        SELECT MaSach FROM deleted
    )
    UPDATE s
    SET s.SoLuongSach = (
        SELECT COUNT(*)
        FROM BanSao bs
        WHERE bs.MaSach    = s.MaSach
          AND bs.TrangThai = N'Trong kho'
    )
    FROM Sach s
    JOIN AffectedSach a ON s.MaSach = a.MaSach;
END
GO

-- FIX Bug 3b: sp_DuyetMuon cũng cần đổi trạng thái 'Chờ duyệt' → 'Đang mượn'
-- vì sp_DangKyMuonOnline đặt BanSao thành 'Chờ duyệt' thay vì 'Trong kho'
-- ============================================================
CREATE OR ALTER PROCEDURE sp_DuyetMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        IF NOT EXISTS (
            SELECT 1 FROM PhieuMuon
            WHERE MaPhieuMuon = @MaPhieuMuon
              AND TrangThai = N'Đăng ký mượn'
        )
        BEGIN
            RAISERROR(N'Phiếu không hợp lệ hoặc đã được xử lý', 16, 1);
            ROLLBACK TRAN;
            RETURN;
        END

        -- Cập nhật phiếu mượn sang Đang mượn
        UPDATE PhieuMuon
        SET NgayMuon  = GETDATE(),
            HanTra    = DATEADD(DAY, 7, GETDATE()),
            TrangThai = N'Đang mượn'
        WHERE MaPhieuMuon = @MaPhieuMuon;

        -- Cập nhật bản sao: Chờ duyệt / Trong kho → Đang mượn
        UPDATE bs
        SET bs.TrangThai = N'Đang mượn'
        FROM BanSao bs
        JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
        WHERE pm.MaPhieuMuon = @MaPhieuMuon;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

-- FIX Bug 4b: sp_HuyPhieuMuon cũng cần trả BanSao về 'Trong kho'
-- khi hủy phiếu ở trạng thái 'Chờ duyệ' (đã giữ bởi sp_DangKyMuonOnline)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_HuyPhieuMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        IF NOT EXISTS (
            SELECT 1 FROM PhieuMuon
            WHERE MaPhieuMuon = @MaPhieuMuon
              AND TrangThai IN (N'Đăng ký mượn', N'Chờ duyệt')
        )
        BEGIN
            RAISERROR(N'Chỉ có thể hủy phiếu đang ở trạng thái chờ duyệt', 16, 1);
            ROLLBACK TRAN;
            RETURN;
        END

        -- Trả bản sao về kho
        UPDATE bs
        SET bs.TrangThai = N'Trong kho'
        FROM BanSao bs
        JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
        WHERE pm.MaPhieuMuon = @MaPhieuMuon
          AND bs.TrangThai IN (N'Chờ duyệt', N'Đang mượn');

        -- Hủy phiếu
        UPDATE PhieuMuon
        SET TrangThai = N'Đã hủy'
        WHERE MaPhieuMuon = @MaPhieuMuon;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        DECLARE @Err2 NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err2, 16, 1);
    END CATCH
END
GO





-- ================================================================
-- PATCH FIX: Sửa schema PhieuMuon + chuẩn hóa TrangThai + SP
-- Chạy file này vào SQL Server để fix lỗi đăng ký mượn 400
-- ================================================================

USE QuanLyThuVien_React;
GO

-- ----------------------------------------------------------------
-- BƯỚC 1: Thêm cột NgayTao vào bảng PhieuMuon (nếu chưa có)
-- ----------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'PhieuMuon' AND COLUMN_NAME = 'NgayTao'
)
BEGIN
    ALTER TABLE PhieuMuon
    ADD NgayTao DATETIME DEFAULT GETDATE();

    -- Gán giá trị mặc định cho các row cũ
    UPDATE PhieuMuon SET NgayTao = GETDATE() WHERE NgayTao IS NULL;

    PRINT N'Đã thêm cột NgayTao vào PhieuMuon';
END
ELSE
    PRINT N'Cột NgayTao đã tồn tại, bỏ qua';
GO

-- ----------------------------------------------------------------
-- BƯỚC 2: Xóa CHECK constraint cũ của TrangThai (PhieuMuon)
--         rồi tạo lại với đủ các giá trị cần thiết
-- ----------------------------------------------------------------
DECLARE @ConstraintName NVARCHAR(200);

SELECT @ConstraintName = cc.CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
JOIN INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
    ON tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'PhieuMuon'
  AND cc.CHECK_CLAUSE LIKE '%TrangThai%';

IF @ConstraintName IS NOT NULL
BEGIN
    EXEC('ALTER TABLE PhieuMuon DROP CONSTRAINT [' + @ConstraintName + ']');
    PRINT N'Đã xóa CHECK constraint cũ: ' + @ConstraintName;
END

ALTER TABLE PhieuMuon
ADD CONSTRAINT CK_PhieuMuon_TrangThai
CHECK (TrangThai IN (
    N'Đăng ký mượn',   -- vừa tạo phiếu, chờ thủ thư duyệt
    N'Chờ duyệt',      -- alias thêm vào cho nhất quán
    N'Đã nhận sách',   -- thủ thư đã duyệt (tên cũ)
    N'Đang mượn',      -- đang mượn (tên frontend dùng)
    N'Quá hạn',        -- quá hạn trả
    N'Đã trả',         -- đã trả sách
    N'Đã hủy',         -- đã hủy (không dấu)
    N'Huỷ',            -- đã hủy (có dấu - tương thích cũ)
    N'Hết hạn'         -- hết hạn giữ chỗ
));
PRINT N'Đã cập nhật CHECK constraint TrangThai của PhieuMuon';
GO

-- ----------------------------------------------------------------
-- BƯỚC 3: sp_DangKyMuonOnline
-- Nhận @MaSach, tự tìm bản sao còn kho, tạo phiếu
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_DangKyMuonOnline
    @MaBanDoc  NVARCHAR(20),
    @MaSach    NVARCHAR(20),
    @HanTra    DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaBanSao    NVARCHAR(20);
    DECLARE @MaPhieuMuon NVARCHAR(20);

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra bạn đọc có phiếu đang chờ/đang mượn sách này không
        IF EXISTS (
            SELECT 1
            FROM PhieuMuon pm
            JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
            WHERE pm.MaBanDoc = @MaBanDoc
              AND bs.MaSach   = @MaSach
              AND pm.TrangThai IN (N'Đăng ký mượn', N'Đang mượn', N'Đã nhận sách', N'Chờ duyệt')
        )
        BEGIN
            RAISERROR(N'Bạn đã có phiếu mượn sách này đang xử lý', 16, 1);
            ROLLBACK TRAN;
            RETURN;
        END

        -- Lấy một bản sao còn trong kho
        SELECT TOP 1 @MaBanSao = MaBanSao
        FROM BanSao WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach   = @MaSach
          AND TrangThai = N'Trong kho'
        ORDER BY MaBanSao;

        IF @MaBanSao IS NULL
        BEGIN
            RAISERROR(N'Sách hiện không còn bản nào trong kho để mượn', 16, 1);
            ROLLBACK TRAN;
            RETURN;
        END

        -- Tạo mã phiếu mượn
        SELECT @MaPhieuMuon =
            'PM' + RIGHT('000' +
            CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon, 3, 10) AS INT)), 0) + 1 AS NVARCHAR), 3)
        FROM PhieuMuon WITH (UPDLOCK, HOLDLOCK);

        -- Tạo phiếu ở trạng thái "Đăng ký mượn" (chờ thủ thư duyệt)
        INSERT INTO PhieuMuon
            (MaPhieuMuon, MaBanDoc, MaBanSao, NgayMuon, HanTra, SoLanGiaHan, TrangThai, NgayTao)
        VALUES
            (@MaPhieuMuon, @MaBanDoc, @MaBanSao, NULL, @HanTra, 0, N'Đăng ký mượn', GETDATE());

        -- Đánh dấu bản sao đang chờ xử lý
        UPDATE BanSao
        SET TrangThai = N'Đang mượn'
        WHERE MaBanSao = @MaBanSao;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

-- ----------------------------------------------------------------
-- BƯỚC 4: sp_XemPhieuMuonTheoBanDoc (cho trang Rentals của user)
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_XemPhieuMuonTheoBanDoc
    @MaBanDoc NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        pm.MaPhieuMuon,
        bd.HoTen              AS TenBanDoc,
        s.TieuDe              AS TenSach,
        CAST(pm.NgayTao AS DATE) AS NgayTao,
        pm.NgayMuon,
        pm.HanTra,
        pm.TrangThai
    FROM PhieuMuon pm
    JOIN BanDoc  bd ON pm.MaBanDoc = bd.MaBanDoc
    JOIN BanSao  bs ON pm.MaBanSao = bs.MaBanSao
    JOIN Sach     s ON bs.MaSach   = s.MaSach
    WHERE pm.MaBanDoc = @MaBanDoc
    ORDER BY pm.NgayTao DESC;
END
GO

-- ----------------------------------------------------------------
-- BƯỚC 5: sp_DuyetMuon - duyệt phiếu, chuyển sang "Đang mượn"
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_DuyetMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        IF NOT EXISTS (
            SELECT 1 FROM PhieuMuon
            WHERE MaPhieuMuon = @MaPhieuMuon
              AND TrangThai = N'Đăng ký mượn'
        )
        BEGIN
            RAISERROR(N'Phiếu không hợp lệ hoặc đã được xử lý', 16, 1);
            ROLLBACK TRAN;
            RETURN;
        END

        UPDATE PhieuMuon
        SET NgayMuon  = GETDATE(),
            HanTra    = DATEADD(DAY, 7, GETDATE()),
            TrangThai = N'Đang mượn'
        WHERE MaPhieuMuon = @MaPhieuMuon;

        -- BanSao đã là 'Đang mượn' từ lúc đăng ký, không cần UPDATE lại

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

-- ----------------------------------------------------------------
-- BƯỚC 6: sp_HuyPhieuMuon - trả BanSao về kho khi hủy phiếu
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_HuyPhieuMuon
    @MaPhieuMuon NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        IF NOT EXISTS (
            SELECT 1 FROM PhieuMuon
            WHERE MaPhieuMuon = @MaPhieuMuon
              AND TrangThai = N'Đăng ký mượn'
        )
        BEGIN
            RAISERROR(N'Chỉ có thể hủy phiếu đang ở trạng thái chờ duyệt', 16, 1);
            ROLLBACK TRAN;
            RETURN;
        END

        -- Trả bản sao về kho
        UPDATE bs
        SET bs.TrangThai = N'Trong kho'
        FROM BanSao bs
        JOIN PhieuMuon pm ON bs.MaBanSao = pm.MaBanSao
        WHERE pm.MaPhieuMuon = @MaPhieuMuon;

        UPDATE PhieuMuon
        SET TrangThai = N'Đã hủy'
        WHERE MaPhieuMuon = @MaPhieuMuon;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

-- ----------------------------------------------------------------
-- BƯỚC 7: Trigger SoLuongSach - đếm bản sao "Trong kho"
--         (chạy cả khi UPDATE TrangThai)
-- ----------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_UpdateSoLuong;
GO

CREATE TRIGGER trg_UpdateSoLuong
ON BanSao
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH AffectedSach AS (
        SELECT MaSach FROM inserted
        UNION
        SELECT MaSach FROM deleted
    )
    UPDATE s
    SET s.SoLuongSach = (
        SELECT COUNT(*)
        FROM BanSao bs
        WHERE bs.MaSach    = s.MaSach
          AND bs.TrangThai = N'Trong kho'
    )
    FROM Sach s
    JOIN AffectedSach a ON s.MaSach = a.MaSach;
END
GO

-- ----------------------------------------------------------------
-- BƯỚC 8: sp_KiemTraQuaHan - cập nhật phiếu quá hạn
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_KiemTraQuaHan
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE PhieuMuon
    SET TrangThai = N'Quá hạn'
    WHERE TrangThai = N'Đang mượn'
      AND HanTra < CAST(GETDATE() AS DATE);
END
GO

-- ----------------------------------------------------------------
-- BƯỚC 9: sp_HienThiPhieuMuon - hiển thị tất cả phiếu (thủ thư)
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_HienThiPhieuMuon
AS
BEGIN
    SET NOCOUNT ON;

    EXEC sp_KiemTraQuaHan;

    SELECT
        pm.MaPhieuMuon,
        bd.HoTen   AS TenBanDoc,
        s.TieuDe   AS TenSach,
        pm.NgayMuon,
        pm.HanTra,
        pm.TrangThai
    FROM PhieuMuon pm
    JOIN BanDoc  bd ON pm.MaBanDoc = bd.MaBanDoc
    JOIN BanSao  bs ON pm.MaBanSao = bs.MaBanSao
    JOIN Sach     s ON bs.MaSach   = s.MaSach
    ORDER BY pm.NgayTao DESC;
END
GO
PRINT N'=== Patch hoàn tất! ===';

-- ================================================================
-- PATCH: Sửa toàn bộ flow Đặt chỗ
-- Vấn đề 1: sp_DatCho không SELECT kết quả → DAL không biết MUON_LUON hay DAT_CHO
-- Vấn đề 2: sp_DatCho không tự tạo phiếu mượn khi sách còn
-- Vấn đề 3: Admin duyệt đặt chỗ → sp_TuDongMuonTuDatCho tìm bản sao "Trong kho"
--           nhưng khi đặt chỗ thành công sách đã bị giữ → không tìm được bản sao
-- ================================================================

USE QuanLyThuVien_React;
GO

-- ----------------------------------------------------------------
-- FIX 1 + 2: sp_DatCho - tự động mượn luôn nếu còn sách,
--            xếp hàng chờ nếu hết sách,
--            và SELECT kết quả trả về cho DAL
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_DatCho
    @MaBanDoc NVARCHAR(20),
    @MaSach   NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra đã đặt chỗ hay đang mượn sách này rồi chưa
        IF EXISTS (
            SELECT 1 FROM DatCho
            WHERE MaSach   = @MaSach
              AND MaBanDoc = @MaBanDoc
              AND TrangThai = N'Đang chờ'
        )
        BEGIN
            RAISERROR(N'Bạn đã đặt chỗ sách này rồi, vui lòng chờ xử lý', 16, 1);
            ROLLBACK;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM PhieuMuon pm
            JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
            WHERE pm.MaBanDoc = @MaBanDoc
              AND bs.MaSach   = @MaSach
              AND pm.TrangThai IN (N'Đăng ký mượn', N'Đang mượn', N'Quá hạn')
        )
        BEGIN
            RAISERROR(N'Bạn đang có phiếu mượn sách này chưa trả', 16, 1);
            ROLLBACK;
            RETURN;
        END

        -- ── Trường hợp A: Sách CÒN trong kho → tạo phiếu mượn luôn ──
        DECLARE @MaBanSao    NVARCHAR(20);
        DECLARE @MaPhieuMuon NVARCHAR(20);

        SELECT TOP 1 @MaBanSao = MaBanSao
        FROM BanSao WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach    = @MaSach
          AND TrangThai = N'Trong kho'
        ORDER BY MaBanSao;

        IF @MaBanSao IS NOT NULL
        BEGIN
            -- Tạo mã phiếu mượn
            SELECT @MaPhieuMuon =
                'PM' + RIGHT('000' +
                CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon, 3, 10) AS INT)), 0) + 1 AS NVARCHAR), 3)
            FROM PhieuMuon WITH (UPDLOCK, HOLDLOCK);

            -- Tạo phiếu mượn ở trạng thái "Đăng ký mượn" (chờ thủ thư xác nhận trao sách)
            INSERT INTO PhieuMuon
                (MaPhieuMuon, MaBanDoc, MaBanSao, NgayMuon, HanTra, SoLanGiaHan, TrangThai, NgayTao)
            VALUES
                (@MaPhieuMuon, @MaBanDoc, @MaBanSao, NULL,
                 DATEADD(DAY, 7, GETDATE()), 0, N'Đăng ký mượn', GETDATE());

            -- Giữ bản sao (đang trong quá trình xử lý)
            UPDATE BanSao
            SET TrangThai = N'Đang mượn'
            WHERE MaBanSao = @MaBanSao;

            COMMIT;

            -- Trả kết quả cho DAL
            SELECT
                'MUON_LUON'                                      AS KetQua,
                N'Sách còn! Phiếu mượn đã được tạo. Vui lòng đến thư viện nhận sách.' AS ThongBao;
            RETURN;
        END;

        -- ── Trường hợp B: Sách HẾT → xếp hàng chờ ──
        DECLARE @MaDatCho NVARCHAR(20);
        DECLARE @ThuTu    INT;

        SELECT @ThuTu = ISNULL(MAX(ThuTu), 0) + 1
        FROM DatCho WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach    = @MaSach
          AND TrangThai = N'Đang chờ';

        SET @MaDatCho = 'DC' + CAST(NEXT VALUE FOR dbo.Seq_DatCho AS NVARCHAR);

        INSERT INTO DatCho (MaDatCho, MaSach, MaBanDoc, ThoiGianGiuCho, TrangThai, ThuTu)
        VALUES (@MaDatCho, @MaSach, @MaBanDoc, DATEADD(DAY, 7, GETDATE()), N'Đang chờ', @ThuTu);

        COMMIT;

        -- Trả kết quả cho DAL
        SELECT
            'DAT_CHO'                                                               AS KetQua,
            N'Sách đang hết. Bạn đã được xếp vào danh sách chờ số ' +
            CAST(@ThuTu AS NVARCHAR) + N'.'                                         AS ThongBao;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

-- ----------------------------------------------------------------
-- FIX 3: sp_TuDongMuonTuDatCho - dùng cho admin bấm "Duyệt" trên trang Đặt chỗ
-- Khi admin duyệt: tìm người đầu hàng → tìm bản sao "Trong kho" → tạo phiếu mượn
-- Bản sao phải là "Trong kho" (đã được trả về sau khi trả sách hoặc admin thao tác)
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_TuDongMuonTuDatCho
    @MaSach NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaBanDoc    NVARCHAR(20);
    DECLARE @MaDatCho    NVARCHAR(20);
    DECLARE @MaBanSao    NVARCHAR(20);
    DECLARE @MaPhieuMuon NVARCHAR(20);

    BEGIN TRY
        BEGIN TRAN;

        -- Lấy người đứng đầu hàng chờ
        SELECT TOP 1
            @MaBanDoc = MaBanDoc,
            @MaDatCho = MaDatCho
        FROM DatCho WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach    = @MaSach
          AND TrangThai = N'Đang chờ'
        ORDER BY ThuTu;

        IF @MaBanDoc IS NULL
        BEGIN
            RAISERROR(N'Không có ai trong danh sách chờ cho sách này', 16, 1);
            ROLLBACK;
            RETURN;
        END

        -- Lấy bản sao còn trong kho
        SELECT TOP 1 @MaBanSao = MaBanSao
        FROM BanSao WITH (UPDLOCK, HOLDLOCK)
        WHERE MaSach    = @MaSach
          AND TrangThai = N'Trong kho'
        ORDER BY MaBanSao;

        IF @MaBanSao IS NULL
        BEGIN
            RAISERROR(N'Sách chưa được trả về kho, chưa thể duyệt cho người chờ', 16, 1);
            ROLLBACK;
            RETURN;
        END

        -- Tạo mã phiếu mượn
        SELECT @MaPhieuMuon =
            'PM' + RIGHT('000' +
            CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon, 3, 10) AS INT)), 0) + 1 AS NVARCHAR), 3)
        FROM PhieuMuon WITH (UPDLOCK, HOLDLOCK);

        -- Tạo phiếu mượn
        INSERT INTO PhieuMuon
            (MaPhieuMuon, MaBanDoc, MaBanSao, NgayMuon, HanTra, SoLanGiaHan, TrangThai, NgayTao)
        VALUES
            (@MaPhieuMuon, @MaBanDoc, @MaBanSao, NULL,
             DATEADD(DAY, 7, GETDATE()), 0, N'Đăng ký mượn', GETDATE());

        -- Giữ bản sao
        UPDATE BanSao
        SET TrangThai = N'Đang mượn'
        WHERE MaBanSao = @MaBanSao;

        -- Đánh dấu đặt chỗ đã xử lý
        UPDATE DatCho
        SET TrangThai = N'Đã xử lý'
        WHERE MaDatCho = @MaDatCho;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

-- ----------------------------------------------------------------
-- Cập nhật sp_GiaHan để hỗ trợ cả trạng thái "Đang mượn"
-- (trước chỉ hỗ trợ 'Đã nhận sách')
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_GiaHan
    @MaPhieuMuon NVARCHAR(20),
    @SoNgayThem  INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM PhieuMuon
        WHERE MaPhieuMuon = @MaPhieuMuon
          AND TrangThai IN (N'Đang mượn', N'Đã nhận sách')
    )
    BEGIN
        RAISERROR(N'Chỉ có thể gia hạn phiếu đang mượn', 16, 1);
        RETURN;
    END

    UPDATE PhieuMuon
    SET HanTra      = DATEADD(DAY, @SoNgayThem, HanTra),
        SoLanGiaHan = SoLanGiaHan + 1
    WHERE MaPhieuMuon = @MaPhieuMuon;
END
GO

-- ----------------------------------------------------------------
-- Cập nhật sp_KiemTraQuaHan để hỗ trợ cả "Đang mượn"
-- ----------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_KiemTraQuaHan
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE PhieuMuon
    SET TrangThai = N'Quá hạn'
    WHERE TrangThai IN (N'Đang mượn', N'Đã nhận sách')
      AND CAST(HanTra AS DATE) < CAST(GETDATE() AS DATE);
END
GO

PRINT N'=== Patch DatCho flow hoàn tất! ===';