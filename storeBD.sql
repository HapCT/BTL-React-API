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

CREATE OR ALTER PROCEDURE sp_DangNhap
    @TenTaiKhoan NVARCHAR(20),
    @MatKhau NVARCHAR(255)
AS
BEGIN
    -- kiểm tra tài khoản
    IF NOT EXISTS (
        SELECT 1 
        FROM TaiKhoan 
        WHERE TenTaiKhoan = @TenTaiKhoan 
        AND MatKhau = @MatKhau
    )
    BEGIN
        SELECT 
            N'Sai tài khoản hoặc mật khẩu' AS Message,
            0 AS Status
        RETURN
    END

    -- trả dữ liệu user
    SELECT 
        tk.TenTaiKhoan,
		tk.MatKhau,	
        tk.VaiTro,
        1 AS Status
    FROM TaiKhoan tk
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
	s.SoLuongSach,
	s.HinhAnh
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
	@SoLuongSach INT,
	@HinhAnh NVARCHAR(255)
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
		SoLuongSach,
		HinhAnh
	)
	VALUES
	(
		@MaSach,
		@TieuDe,
		@TacGia,
		@MaTheLoai,
		@NamXB,
		@NgonNgu,
		@SoLuongSach,
		@HinhAnh
	)

END
GO
SELECT * FROM TheLoai
-- Sửa sách
CREATE PROCEDURE sp_SuaSach
    @MaSach NVARCHAR(20),
    @MaTheLoai NVARCHAR(20),
    @TieuDe NVARCHAR(50),
    @TacGia NVARCHAR(20),
    @NamXB NVARCHAR(10),
    @NgonNgu NVARCHAR(20),
    @SoLuongSach INT,
    @HinhAnh NVARCHAR(255) = NULL,
    @HinhAnhCu NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

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
        SoLuongSach = @SoLuongSach,
        HinhAnh = ISNULL(@HinhAnh, @HinhAnhCu)
    WHERE MaSach = @MaSach
END
GO
DROP PROCEDURE sp_SuaSach 

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
            N'Đăng ký mượn'     -- trạng thái chờ duyệt
        )

        COMMIT TRAN
    END
    ELSE
    BEGIN
        ROLLBACK TRAN
        RAISERROR(N'Sách không khả dụng',16,1)
    END
END


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
CREATE PROCEDURE sp_HienThiPhieuMuon
AS
BEGIN
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
CREATE PROCEDURE sp_DuyetMuon
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
CREATE PROCEDURE sp_TaoPhieuMuon_Offline
    @MaPhieuMuon NVARCHAR(20),
    @MaBanDoc NVARCHAR(20),
    @MaBanSao NVARCHAR(20),
    @NgayMuon DATE,
    @HanTra DATE
AS
BEGIN
	SELECT @MaPhieuMuon =
		'PM' + RIGHT('000' +
		CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuMuon,2,10) AS INT)),0) + 1 AS NVARCHAR),3)
	FROM PhieuMuon
    IF EXISTS (
        SELECT 1 FROM BanSao
        WHERE MaBanSao = @MaBanSao
        AND TrangThai = 0
    )
    BEGIN
        INSERT INTO PhieuMuon
        VALUES
        (
            @MaPhieuMuon,
            @MaBanDoc,
            @MaBanSao,
            @NgayMuon,
            @HanTra,
            0,
            N'Đã nhận sách'
        )

        UPDATE BanSao
        SET TrangThai = 1
        WHERE MaBanSao = @MaBanSao
    END
    ELSE
    BEGIN
        RAISERROR(N'Sách không khả dụng',16,1)
    END
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
    UPDATE PhieuMuon
    SET TrangThai = N'Huỷ'
	WHERE TrangThai LIKE N'%Đăng%'
    AND TrangThai = N'Đăng ký mượn'
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
CREATE PROCEDURE spPhat
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

    -- Lấy thông tin phiếu mượn
    SELECT 
        @HanTra = HanTra,
        @MaBanDoc = MaBanDoc
    FROM PhieuMuon
    WHERE MaPhieuMuon = @MaPhieuMuon

    -- Tính số ngày trễ
    IF (@NgayTra > @HanTra)
        SET @SoNgayTre = DATEDIFF(DAY, @HanTra, @NgayTra)

    -- Tính tiền phạt trễ hạn
    SET @SoTien = @SoNgayTre * 5000

    -- Nếu có lý do thêm (hỏng/mất)
    IF (@LyDoPhat LIKE N'%hỏng%')
        SET @SoTien = @SoTien + 50000

    IF (@LyDoPhat LIKE N'%mất%')
        SET @SoTien = @SoTien + 200000

    -- Tạo mã phạt (tự tăng đơn giản)
    SELECT @MaPhat = 'P' + RIGHT('0000' + CAST(COUNT(*) + 1 AS VARCHAR), 4)
    FROM Phat

    -- Insert vào bảng Phạt
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

    -- Cập nhật dư nợ bạn đọc
    UPDATE BanDoc
    SET DuNo = ISNULL(DuNo, 0) + @SoTien
    WHERE MaBanDoc = @MaBanDoc

END
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
CREATE PROCEDURE sp_HuyPhat
    @MaPhat NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Phat
    SET TrangThai = N'Đã huỷ'
    WHERE 
        MaPhat = @MaPhat
        AND TrangThai = N'Chưa thanh toán'
END
GO
--

ALTER PROCEDURE sp_ThanhToanPhat
    @MaPhat NVARCHAR(20),
    @HinhThucThanhToan NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN

        DECLARE 
            @SoTien DECIMAL,
            @MaBanDoc NVARCHAR(20),
            @MaThanhToan NVARCHAR(20)

        -- Lấy dữ liệu
        SELECT 
            @SoTien = p.SoTien,
            @MaBanDoc = bd.MaBanDoc
        FROM Phat p
        JOIN PhieuMuon pm ON p.MaPhieuMuon = pm.MaPhieuMuon
        JOIN BanDoc bd ON pm.MaBanDoc = bd.MaBanDoc
        WHERE p.MaPhat = @MaPhat
          AND p.TrangThai = N'Chưa thanh toán'

        IF @SoTien IS NULL
        BEGIN
            ROLLBACK
            RETURN
        END

        -- Update phạt
        UPDATE Phat
        SET TrangThai = N'Đã thanh toán'
        WHERE MaPhat = @MaPhat

        -- Trừ nợ
        UPDATE BanDoc
        SET DuNo = ISNULL(DuNo,0) - @SoTien
        WHERE MaBanDoc = @MaBanDoc

        -- Tạo mã thanh toán
        SELECT @MaThanhToan = 'TT' + RIGHT('0000' + CAST(COUNT(*) + 1 AS VARCHAR), 4)
        FROM ThanhToan

        -- 🔥 Lưu hình thức thanh toán
        INSERT INTO ThanhToan
(
    MaThanhToan,
    MaBanDoc,
    NgayThanhToan,
    SoTien,
    HinhThucThanhToan,
    GhiChu,
    TrangThai
)
VALUES
(
    @MaThanhToan,
    @MaBanDoc,
    GETDATE(),
    @SoTien,
    @HinhThucThanhToan,
    N'Thanh toán phạt ' + @MaPhat,
    N'Đã thanh toán'
)

        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK
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
GO SELECT * FROM ThanhToan
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