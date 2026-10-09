-- Chạy toàn bộ script này trên database đang chứa bảng dbo.QS_KhachHang.
-- Đăng ký mới có TrangThai = 0; sau khi check-in sẽ chuyển thành 1.

CREATE OR ALTER PROCEDURE dbo.QS_ins_KhachHang
    @Hoten NVARCHAR(1000),
    @NoiCongTac NVARCHAR(1000),
    @SoPhieu INT,
    @LoaiDS NVARCHAR(100),
    @NgayTao DATETIME,
    @NgayThamDu DATETIME,
    @NgayQuaySo DATETIME,
    @GiaiTrung NVARCHAR(100),
    @GiaiFix NVARCHAR(100),
    @SoDienThoai NVARCHAR(100),
    @HuyBo BIT = 0,
    @TrangThai INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF EXISTS (
            SELECT 1
            FROM dbo.QS_KhachHang WITH (UPDLOCK, HOLDLOCK)
            WHERE REPLACE(REPLACE(REPLACE(LTRIM(RTRIM(SoDienThoai)), ' ', ''), '-', ''), '.', '') =
                  REPLACE(REPLACE(REPLACE(LTRIM(RTRIM(@SoDienThoai)), ' ', ''), '-', ''), '.', '')
        )
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT -1 AS NewID;
            RETURN;
        END;

        DECLARE @NewStt INT;

        SELECT TOP (1) @NewStt = Stt + 1
        FROM dbo.QS_KhachHang WITH (UPDLOCK, HOLDLOCK)
        ORDER BY Stt DESC;

        SET @NewStt = ISNULL(@NewStt, 1);

        INSERT INTO dbo.QS_KhachHang
        (
            Stt,
            Hoten,
            NoiCongTac,
            SoPhieu,
            LoaiDS,
            NgayTao,
            NgayThamDu,
            NgayQuaySo,
            GiaiTrung,
            GiaiFix,
            SoDienThoai,
            HuyBo,
            TrangThai
        )
        VALUES
        (
            @NewStt,
            @Hoten,
            @NoiCongTac,
            @SoPhieu,
            @LoaiDS,
            @NgayTao,
            @NgayThamDu,
            @NgayQuaySo,
            @GiaiTrung,
            @GiaiFix,
            @SoDienThoai,
            @HuyBo,
            @TrangThai
        );

        COMMIT TRANSACTION;

        SELECT @NewStt AS NewID;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH;
END;
GO

CREATE OR ALTER PROCEDURE dbo.QS_upd_KhachHang
    @Stt INT,
    @Hoten NVARCHAR(1000),
    @NoiCongTac NVARCHAR(1000),
    @SoPhieu INT,
    @LoaiDS NVARCHAR(100),
    @NgayTao NVARCHAR(50),
    @NgayThamDu NVARCHAR(50),
    @NgayQuaySo NVARCHAR(50),
    @GiaiTrung NVARCHAR(100),
    @GiaiFix NVARCHAR(100),
    @SoDienThoai NVARCHAR(100),
    @HuyBo BIT,
    @TrangThai INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.QS_KhachHang
    SET Hoten = @Hoten,
        NoiCongTac = @NoiCongTac,
        SoPhieu = @SoPhieu,
        LoaiDS = @LoaiDS,
        NgayTao = TRY_CONVERT(DATETIME, NULLIF(@NgayTao, ''), 121),
        NgayThamDu = TRY_CONVERT(DATETIME, NULLIF(@NgayThamDu, ''), 121),
        NgayQuaySo = TRY_CONVERT(DATETIME, NULLIF(@NgayQuaySo, ''), 121),
        GiaiTrung = @GiaiTrung,
        GiaiFix = @GiaiFix,
        SoDienThoai = @SoDienThoai,
        HuyBo = @HuyBo,
        TrangThai = @TrangThai
    WHERE Stt = @Stt;

    SELECT @@ROWCOUNT AS UpdatedRows;
END;
GO

CREATE OR ALTER PROCEDURE dbo.QS_upd_KhachHang_xac_nhan_tham_gia
    @SoDienThoai NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SoDienThoaiDaChuanHoa NVARCHAR(100) =
        REPLACE(REPLACE(REPLACE(LTRIM(RTRIM(@SoDienThoai)), ' ', ''), '-', ''), '.', '');
    DECLARE @Stt INT;

    IF @SoDienThoaiDaChuanHoa = N''
    BEGIN
        SELECT 0 AS Success, N'Vui lòng nhập số điện thoại.' AS Message;
        RETURN;
    END;

    SELECT TOP (1) @Stt = Stt
    FROM dbo.QS_KhachHang
    WHERE REPLACE(REPLACE(REPLACE(LTRIM(RTRIM(SoDienThoai)), ' ', ''), '-', ''), '.', '') = @SoDienThoaiDaChuanHoa
      AND ISNULL(TrangThai, 0) <> -1
    ORDER BY Stt;

    IF @Stt IS NULL
    BEGIN
        SELECT 0 AS Success,
               N'Không tìm thấy thông tin đăng ký. Vui lòng kiểm tra lại số điện thoại.' AS Message;
        RETURN;
    END;

    IF EXISTS (
        SELECT 1
        FROM dbo.QS_KhachHang
        WHERE Stt = @Stt
          AND TrangThai = 1
    )
    BEGIN
        SELECT 1 AS Success,
               N'Bạn đã xác nhận tham gia trước đó.' AS Message,
               @Stt AS Stt,
               @Stt AS SoThuTu;
        RETURN;
    END;

    UPDATE dbo.QS_KhachHang
    SET TrangThai = 1,
        NgayThamDu = GETDATE()
    WHERE Stt = @Stt;

    SELECT 1 AS Success,
           N'Xác nhận tham gia thành công!' AS Message,
           @Stt AS Stt,
           @Stt AS SoThuTu;
END;
GO
