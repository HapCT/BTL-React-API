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


--Thêm bạn đọc
CREATE PROCEDURE sp_ThemBanDoc
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

	INSERT INTO BanDoc 
	VALUES (@MaBanDoc, @SoThe, @HoTen, @Email, @SoDienThoai, @HanThe, N'Hoạt động', 0, @CCCD)

END

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
CREATE PROCEDURE sp_XoaBanDoc
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

	DELETE FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc

	PRINT N'Xoá bạn đọc thành công'

END
GO

-- Tìm kiếm theo id 
CREATE PROCEDURE sp_TimBanDocTheoID
	@MaBanDoc NVARCHAR(20)
AS
BEGIN

	SELECT *
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
CREATE PROCEDURE sp_DangKy
    @TenTaiKhoan NVARCHAR(20),
    @MatKhau NVARCHAR(255),
    @HoTen NVARCHAR(100),
    @CCCD NVARCHAR(12),
    @SoDienThoai NVARCHAR(15),
    @Email NVARCHAR(100)
AS
BEGIN

    DECLARE @MaBanDoc NVARCHAR(20)

    -- tạo mã bạn đọc tự động
    SELECT @MaBanDoc = 'BD' + RIGHT('000' + CAST(COUNT(*) + 1 AS NVARCHAR),3)
    FROM BanDoc

    -- thêm vào bảng bạn đọc
    INSERT INTO BanDoc
    (
        MaBanDoc,
        HoTen,
        CCCD,
        SoDienThoai,
        Email
    )
    VALUES
    (
        @MaBanDoc,
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
CREATE PROCEDURE sp_DangNhap
    @TenTaiKhoan NVARCHAR(20),
    @MatKhau NVARCHAR(255)
AS
BEGIN
	IF NOT EXISTS (
		SELECT 1 
		FROM TaiKhoan 
		WHERE TenTaiKhoan = @TenTaiKhoan 
		AND MatKhau = @MatKhau
	)
	BEGIN
		PRINT N'Sai tài khoản hoặc mật khẩu'
		RETURN
	END
    SELECT 
        tk.TenTaiKhoan,
        tk.VaiTro,
        bd.MaBanDoc,
        bd.HoTen
    FROM TaiKhoan tk
    LEFT JOIN BanDoc bd 
        ON tk.MaBanDoc = bd.MaBanDoc
    WHERE tk.TenTaiKhoan = @TenTaiKhoan
    AND tk.MatKhau = @MatKhau

END
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