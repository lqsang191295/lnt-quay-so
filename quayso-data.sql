
DECLARE @NewID INT;
 
		select @NewID=max(isnull(Stt,0))+1 from QS_KhachHang; 
		if @NewID is null 
			set @NewID=1
		SELECT @NewID AS NewID;  

select * from update QS_KhachHang set  GiaiFix='' where GiaiFix='3'



select * from QS_KhachHang where GiaiFix='3'


select * from QS_KhachHang where GiaiFix in ('db','1','2','3')


SET IDENTITY_INSERT HIS_DATA.dbo.QS_KhachHang OFF;

SELECT bpcd.* FROM HIS_DATA.dbo.BV_PhieuChidinhDV AS bpcd
WHERE bpcd.Sovaovien ='2102871' or bpcd.Sonhapvien ='2102871'
 MaBN ='062895' or
select distinct len(sobhyt) ll from bv_qlycapthe
select top 10 sobhyt from bv_qlycapthe where len(sobhyt) =12;

SELECT * FROM HIS_DATA.dbo.QS_KhachHang
        WHERE TrangThai=1  ;
dbo.QS_get_KhachHang 0

update 

--
----    	SET @NewID = SCOPE_IDENTITY();
----
		UPDATE QS_KhachHang
		SET stt = stt+1, sophieu=sophieu+1
--		WHERE Stt = @NewID;


--script sinh danh sách họ tên ngẫu nhiên (630 dòng) theo phân bố:
--Tiếng Việt:
--Tên 2 từ: 5% (~32 người)
--Tên 3 từ: 70% (~441 người)
--Tên 4 từ: 10% (~63 người)
--Tên 5 từ: 3% (~19 người)
--Tên Campuchia phiên âm Latin: 3% (~19 người)
--Tên tiếng Anh: 2% (~13 người)
--Sau đó UPDATE vào bảng QS_KhachHang với Stt tương ứng (1 → 630).


-- Bảng tạm lưu danh sách tên
IF OBJECT_ID('tempdb..#NameList') IS NOT NULL DROP TABLE #NameList;
CREATE TABLE #NameList (
    Stt INT IDENTITY(588,1), -- bắt đầu từ 588 → 630
    HoTen NVARCHAR(200)
);

DECLARE @Total INT = 43;
DECLARE @count2 INT = ROUND(@Total * 0.05,0);  -- 2 từ
DECLARE @count3 INT = ROUND(@Total * 0.70,0);  -- 3 từ
DECLARE @count4 INT = ROUND(@Total * 0.10,0);  -- 4 từ
DECLARE @count5 INT = ROUND(@Total * 0.03,0);  -- 5 từ
DECLARE @countKH INT = ROUND(@Total * 0.03,0); -- Khmer
DECLARE @countEN INT = ROUND(@Total * 0.02,0); -- English

-- Danh sách họ & tên Việt
DECLARE @Ho NVARCHAR(200) = N'Nguyễn,Trần,Lê,Phạm,Hoàng,Huỳnh,Phan,Vũ,Võ,Đặng,Bùi,Đỗ,Hồ,Ngô,Dương,Đinh';
DECLARE @Ten NVARCHAR(200) = N'An,Bình,Cường,Đạt,Dũng,Giang,Hải,Hùng,Khoa,Khánh,Lâm,Long,Minh,Nam,Phong,
Quân,Sơn,Tài,Thắng,Trung,Tú,Việt,Quang,Hòa,Thịnh,Toàn,Hiếu,Hải,Yến,Lan,Hoa,Hương,Linh,Thảo,Trang,Ngọc,My,Anh,Phương';

-- Khmer
DECLARE @TenKH NVARCHAR(200) = N'Sok,Chan,Chhay,Dara,Vann,Somnang,Piseth,Rithy,Sovann,Theara,Bopha,Srey,Veasna,Rith';

-- English
DECLARE @TenEN NVARCHAR(200) = N'John,Michael,David,James,Robert,William,Daniel,Thomas,Richard,Joseph,Mary,Linda,Elizabeth,Jennifer,Jessica,Susan';

-- Đưa vào bảng tạm
IF OBJECT_ID('tempdb..#Ho') IS NOT NULL DROP TABLE #Ho;
IF OBJECT_ID('tempdb..#Ten') IS NOT NULL DROP TABLE #Ten;
IF OBJECT_ID('tempdb..#TenKH') IS NOT NULL DROP TABLE #TenKH;
IF OBJECT_ID('tempdb..#TenEN') IS NOT NULL DROP TABLE #TenEN;

SELECT value AS Ho INTO #Ho FROM STRING_SPLIT(@Ho,',');
SELECT value AS Ten INTO #Ten FROM STRING_SPLIT(@Ten,',');
SELECT value AS Ten INTO #TenKH FROM STRING_SPLIT(@TenKH,',');
SELECT value AS Ten INTO #TenEN FROM STRING_SPLIT(@TenEN,',');

-- Việt 2 từ
INSERT INTO #NameList(HoTen)
SELECT TOP (@count2)
    h.Ho + N' ' + t.Ten
FROM #Ho h CROSS JOIN #Ten t
ORDER BY NEWID();

-- Việt 3 từ
INSERT INTO #NameList(HoTen)
SELECT TOP (@count3)
    h.Ho + N' ' + t1.Ten + N' ' + t2.Ten
FROM #Ho h CROSS JOIN #Ten t1 CROSS JOIN #Ten t2
ORDER BY NEWID();

-- Việt 4 từ
INSERT INTO #NameList(HoTen)
SELECT TOP (@count4)
    h.Ho + N' ' + t1.Ten + N' ' + t2.Ten + N' ' + t3.Ten
FROM #Ho h CROSS JOIN #Ten t1 CROSS JOIN #Ten t2 CROSS JOIN #Ten t3
ORDER BY NEWID();

-- Việt 5 từ
INSERT INTO #NameList(HoTen)
SELECT TOP (@count5)
    h.Ho + N' ' + t1.Ten + N' ' + t2.Ten + N' ' + t3.Ten + N' ' + t4.Ten
FROM #Ho h CROSS JOIN #Ten t1 CROSS JOIN #Ten t2 CROSS JOIN #Ten t3 CROSS JOIN #Ten t4
ORDER BY NEWID();

-- Khmer
INSERT INTO #NameList(HoTen)
SELECT TOP (@countKH)
    kh1.Ten + N' ' + kh2.Ten
FROM #TenKH kh1 CROSS JOIN #TenKH kh2
ORDER BY NEWID();

-- English
INSERT INTO #NameList(HoTen)
SELECT TOP (@countEN)
    e1.Ten + N' ' + e2.Ten
FROM #TenEN e1 CROSS JOIN #TenEN e2
ORDER BY NEWID();

-- Cập nhật vào bảng chính (Stt 588 → 630)
UPDATE q
SET q.Hoten = n.HoTen
FROM HIS_DATA.dbo.QS_KhachHang q
JOIN #NameList n ON q.Stt = n.Stt
WHERE q.Stt BETWEEN 588 AND 630;



-- Xóa dữ liệu cũ (nếu cần)
TRUNCATE TABLE HIS_DATA.dbo.QS_KhachHang;

-- Insert 500 nhân viên
-- Insert 500 nhân viên
WITH NV AS (
    SELECT TOP (500)
        ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
    FROM sys.all_objects
)
INSERT INTO HIS_DATA.dbo.QS_KhachHang
(Hoten, NoiCongTac, SoPhieu, LoaiDS, NgayTao, TrangThai)
SELECT 
    N'Nhân viên ' + CAST(rn AS NVARCHAR(10)),
    N'Công ty ABC',
    rn,
    'nv',
    GETDATE(),
    1
FROM NV;

-- Insert 130 khách mời
WITH KH AS (
    SELECT TOP (130)
        ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
    FROM sys.all_objects
)
INSERT INTO HIS_DATA.dbo.QS_KhachHang
(Hoten, NoiCongTac, SoPhieu, LoaiDS, NgayTao, TrangThai)
SELECT 
    N'Khách mời ' + CAST(rn AS NVARCHAR(10)),
    N'Cơ quan XYZ',
    500 + rn,
    'kh',
    GETDATE(),
    1
FROM KH;

-- 1 dòng giải đặc biệt
UPDATE HIS_DATA.dbo.QS_KhachHang
SET GiaiFix = 'db'
WHERE Stt IN (
    SELECT TOP (1) Stt FROM HIS_DATA.dbo.QS_KhachHang ORDER BY NEWID()
);

-- 5 dòng giải 1
UPDATE HIS_DATA.dbo.QS_KhachHang
SET GiaiFix = '1'
WHERE Stt IN (
    SELECT TOP (5) Stt FROM HIS_DATA.dbo.QS_KhachHang WHERE GiaiFix IS NULL ORDER BY NEWID()
);

-- 5 dòng giải 2
UPDATE HIS_DATA.dbo.QS_KhachHang
SET GiaiFix = '2'
WHERE Stt IN (
    SELECT TOP (5) Stt FROM HIS_DATA.dbo.QS_KhachHang WHERE GiaiFix IS NULL ORDER BY NEWID()
);

-- 10 dòng giải 3
UPDATE HIS_DATA.dbo.QS_KhachHang
SET GiaiFix = '3'
WHERE Stt IN (
    SELECT TOP (10) Stt FROM HIS_DATA.dbo.QS_KhachHang WHERE GiaiFix IS NULL ORDER BY NEWID()
);
 





-- HIS_DATA.dbo.QS_KhachHang definition

-- Drop table

-- DROP TABLE HIS_DATA.dbo.QS_KhachHang;
CREATE TABLE HIS_DATA.dbo.QS_KhachHang (
	Stt int IDENTITY(1,1) NOT NULL,
	Hoten nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	NoiCongTac nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	SoPhieu int NULL,
	LoaiDS nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	NgayTao datetime NULL,
	NgayThamDu datetime NULL,
	NgayQuaySo datetime NULL,
	GiaiTrung nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	GiaiFix nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	SoDienThoai nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	HuyBo bit NULL,
	TrangThai int NULL,
	CONSTRAINT QS_KhachHang_PK PRIMARY KEY (Stt)
);

-------------------------------------------------------
-- Insert
-------------------------------------------------------

CREATE PROCEDURE [dbo].[QS_ins_KhachHang]
    @Hoten NVARCHAR(1000),
    @NoiCongTac NVARCHAR(1000),
    @SoPhieu INT,
    @LoaiDS NVARCHAR(100),
    @NgayTao DATETIME,
    @NgayThamDu DATETIME,
    @NgayQuaySo DATETIME,
    @GiaiTrung NVARCHAR(100),
    @GiaiFix NVARCHAR(100),
    @SoDienThoai NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
	if not exists(select 1 from dbo.QS_KhachHang where Hoten=@Hoten and SoDienThoai=@SoDienThoai)   
	begin
	    INSERT INTO dbo.QS_KhachHang
	    (
	        Hoten, NoiCongTac, SoPhieu, LoaiDS,
	        NgayTao, NgayThamDu, NgayQuaySo,
	        GiaiTrung, GiaiFix,SoDienThoai,HuyBo,TrangThai
	    )
	    VALUES
	    (
	        @Hoten, @NoiCongTac, @SoPhieu, @LoaiDS,
	        @NgayTao, @NgayThamDu, @NgayQuaySo,
	        @GiaiTrung, @GiaiFix,@SoDienThoai,0,1
	    );
    	SELECT SCOPE_IDENTITY() AS NewID;
	end
	else 
		SELECT -1 NewID;
	 
END;
GO

-------------------------------------------------------
-- Update
-------------------------------------------------------

CREATE PROCEDURE dbo.QS_upd_KhachHang
    @Stt INT,
    @Hoten NVARCHAR(1000),
    @NoiCongTac NVARCHAR(1000),
    @SoPhieu INT,
    @LoaiDS NVARCHAR(100),
    @NgayTao NVARCHAR(50) ,
    @NgayThamDu NVARCHAR(50) ,
    @NgayQuaySo NVARCHAR(50) ,
    @GiaiTrung NVARCHAR(100),
    @GiaiFix NVARCHAR(100),
    @SoDienThoai NVARCHAR(100),
	@HuyBo BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE HIS_DATA.dbo.QS_KhachHang
    SET Hoten = @Hoten,
        NoiCongTac = @NoiCongTac,
        SoPhieu = @SoPhieu,
        LoaiDS = @LoaiDS,
        NgayTao = CONVERT(datetime, @NgayTao, 121) ,
        NgayThamDu = CONVERT(datetime, @NgayThamDu, 121) ,
        NgayQuaySo = CONVERT(datetime, @NgayQuaySo, 121)  ,
        GiaiTrung = @GiaiTrung,
        GiaiFix = @GiaiFix,
        SoDienThoai=@SoDienThoai,
		HuyBo = @HuyBo
    WHERE Stt = @Stt;

	SELECT 1
END;
go


CREATE PROCEDURE dbo.QS_upd_KhachHang_checkin
    @Stt INT, 
    @NgayThamDu nvarchar(50) -- để dự phòng, lấy từ ngày giờ hệ thống
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.QS_KhachHang
    SET  
        NgayThamDu = getdate()
    WHERE Stt = @Stt;
END;



GO

-------------------------------------------------------
-- Delete
-------------------------------------------------------
CREATE PROCEDURE dbo.QS_del_KhachHang
    @Stt INT
AS
BEGIN
    SET NOCOUNT ON;

    update HIS_DATA.dbo.QS_KhachHang set TrangThai=-1  
    WHERE Stt = @Stt;
END;
GO

-------------------------------------------------------
-- Select (Get)
-------------------------------------------------------
CREATE PROCEDURE dbo.QS_get_KhachHang
    @Stt INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Stt IS NULL
    BEGIN
        SELECT * FROM dbo.QS_KhachHang;
    END
    ELSE
    BEGIN
        SELECT * FROM HIS_DATA.dbo.QS_KhachHang
        WHERE TrangThai=1 and (isnull(@Stt,0)=0 or Stt = @Stt)
    	ORDER BY Stt;
    END
END;

GO

CREATE PROCEDURE dbo.QS_get_KhachHang_TrungGiai
	@GiaiTrung nvarchar(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Stt,
        Hoten,
        NoiCongTac,
        SoPhieu,
        LoaiDS,
        NgayTao,
        NgayThamDu,
        NgayQuaySo,
        GiaiTrung,
        SoDienThoai
    FROM dbo.QS_KhachHang
    WHERE TrangThai=1 and ( ISNULL(@GiaiTrung,0) =0 or (GiaiTrung IS NOT NULL AND LTRIM(RTRIM(GiaiTrung)) <> '' AND GiaiTrung =@GiaiTrung))
    ORDER BY NgayQuaySo ASC, 
             TRY_CAST(GiaiTrung AS INT) ASC;  -- nếu GiaiTrung là số
END;