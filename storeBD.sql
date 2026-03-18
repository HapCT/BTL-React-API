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
SELECT * FROM TaiKhoan
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
CREATE PROCEDURE sp_SuaTheLoai
	@MaTheLoai NVARCHAR(20),
	@TenTheLoai NVARCHAR(50),
	@Mota NVARCHAR(MAX)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM TheLoai WHERE TenTheLoai = @TenTheLoai)
	BEGIN
		PRINT N'Thể loại đã tồn tại'
		RETURN
	END
	UPDATE TheLoai
	SET
		TenTheLoai = @TenTheLoai,
		MoTa = @Mota
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

--Sách 
CREATE PROCEDURE sp_HienThiSach
AS
BEGIN
	SELECT 
	s.MaTheLoai,
	tl.TenTheLoai,
	s.MaSach,
	s.TieuDe,
	s.TacGia,
	s.NamXB,
	s.NgonNgu,
	s.SoLuongSach
	FROM Sach s 
	LEFT JOIN TheLoai tl ON s.MaTheLoai = tl.MaTheLoai
END

--Thêm sách
CREATE OR ALTER PROCEDURE sp_ThemSach
	@MaTheLoai NVARCHAR(20),
	@TieuDe NVARCHAR(50),
	@TacGia NVARCHAR(20),
	@NamXB NVARCHAR(10),
	@NgonNgu NVARCHAR(20),
	@SoLuongSach INT
AS
BEGIN

	-- kiểm tra trùng sách
	IF EXISTS (
		SELECT 1 
		FROM Sach 
		WHERE TieuDe = @TieuDe 
		AND TacGia = @TacGia
	)
	BEGIN
		RAISERROR(N'Sách đã tồn tại',16,1)
		RETURN
	END

	DECLARE @MaSach NVARCHAR(20)

	-- tạo mã sách
	SELECT @MaSach =
	'S' + RIGHT('000' +
	CAST(ISNULL(MAX(CAST(SUBSTRING(MaSach,2,10) AS INT)),0) + 1 AS NVARCHAR),3)
	FROM Sach
	IF @SoLuongSach < 0
	BEGIN
		RAISERROR(N'Số lượng sách không hợp lệ',16,1)
		RETURN
	END
	INSERT INTO Sach
	(
		MaSach,
		TieuDe,
		TacGia,
		MaTheLoai,
		NamXB,
		NgonNgu,
		SoLuongSach
	)
	VALUES
	(
		@MaSach,
		@TieuDe,
		@TacGia,
		@MaTheLoai,
		@NamXB,
		@NgonNgu,
		@SoLuongSach
	)

END
GO

-- Sửa sách
CREATE OR ALTER PROCEDURE sp_SuaSach
	@MaSach NVARCHAR(20),
	@MaTheLoai NVARCHAR(20),
	@TieuDe NVARCHAR(50),
	@TacGia NVARCHAR(20),
	@NamXB NVARCHAR(10),
	@NgonNgu NVARCHAR(20),
	@SoLuongSach INT
AS
BEGIN

	-- kiểm tra trùng sách
	IF EXISTS (
		SELECT 1 
		FROM Sach
		WHERE TieuDe = @TieuDe 
		AND TacGia = @TacGia
		AND MaSach <> @MaSach
	)
	BEGIN
		RAISERROR(N'Sách đã tồn tại',16,1)
		RETURN
	END

	UPDATE Sach
	SET
		TieuDe = @TieuDe,
		TacGia = @TacGia,
		MaTheLoai = @MaTheLoai,
		NamXB = @NamXB,
		NgonNgu = @NgonNgu,
		SoLuongSach = @SoLuongSach
	WHERE MaSach = @MaSach

END
GO
GO
-- Xoá sách
CREATE OR ALTER PROCEDURE sp_XoaSach
	@MaSach NVARCHAR(20)
AS
BEGIN

	-- kiểm tra sách đang được mượn
	IF EXISTS (
		SELECT 1
		FROM ChiTietPhieuMuon ct
		JOIN BanSao bs ON ct.MaBanSao = bs.MaBanSao
		WHERE bs.MaSach = @MaSach
	)
	BEGIN
		PRINT N'Sách đang được mượn'
		RETURN
	END

	-- xoá các bản sao trước
	DELETE FROM BanSao
	WHERE MaSach = @MaSach

	-- xoá sách
	DELETE FROM Sach
	WHERE MaSach = @MaSach

	PRINT N'Xóa sách thành công'

END
GO
-- tìm theo ID
CREATE PROCEDURE sp_TimSachTheoID
    @MaSach NVARCHAR(20)
AS
BEGIN

    SELECT 
        s.MaSach,
        s.TieuDe,
        s.TacGia,
        s.NamXB,
        s.NgonNgu,
        s.SoLuongSach,
        s.MaTheLoai,
        tl.TenTheLoai
    FROM Sach s
    JOIN TheLoai tl 
        ON s.MaTheLoai = tl.MaTheLoai
    WHERE s.MaSach = @MaSach

END
GO

-- Tìm theo từ khoá 
CREATE PROCEDURE sp_TimSach
	@TuKhoa NVARCHAR(50)
AS
BEGIN

	SELECT 
		s.MaTheLoai,
		tl.TenTheLoai,
		s.MaSach,
		s.TieuDe,
		s.TacGia,
		s.NamXB,
		s.NgonNgu,
		s.SoLuongSach
	FROM Sach s
	LEFT JOIN TheLoai tl 
		ON s.MaTheLoai = tl.MaTheLoai
	WHERE 
		s.TieuDe LIKE '%' + @TuKhoa + '%'
		OR s.TacGia LIKE '%' + @TuKhoa + '%'
		OR s.NamXB LIKE '%' + @TuKhoa + '%'
		OR s.NgonNgu LIKE '%' + @TuKhoa + '%'
		OR tl.TenTheLoai LIKE '%' + @TuKhoa + '%'

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
CREATE PROCEDURE sp_XoaBanSao
	@MaBanSao NVARCHAR(20)
AS
BEGIN
	DELETE FROM BanSao
	WHERE MaBanSao = @MaBanSao
END