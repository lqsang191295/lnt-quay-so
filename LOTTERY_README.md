# Hệ Thống Quay Số May Mắn

## Mô tả
Hệ thống quay số tự động cho hội nghị khoa học kỹ thuật với các quy tắc phân bố giải thưởng theo từng đối tượng.

## Cấu trúc dữ liệu

### IDataUser
```typescript
interface IDataUser {
  Stt: string;               // Số thứ tự
  Hoten: string;             // Họ tên
  NoiCongTac: string;        // Nơi công tác
  SoDienThoai: string;       // Số điện thoại
  SoPhieu: number | null;    // Số phiếu tham dự
  LoaiDS: string | null;     // "nv": nhân viên bệnh viện, "kh": khách mời
  NgayTao: Date | null;      // Ngày tạo
  NgayThamDu: Date | null;   // Ngày tham dự
  NgayQuaySo: Date | null;   // Ngày quay số (khi trúng giải)
  GiaiTrung: string | null;  // Giải trúng ("1", "2", "3", "db")
  GiaiFix: string | null;    // Giải được chỉ định trước
}
```

### IDataGiaiThuong
```typescript
interface IDataGiaiThuong {
  id: string;    // "1", "2", "3", "db"
  ten: string;   // Tên giải
  sl: number;    // Số lượng giải
}
```

## Quy tắc quay số

### Giải Ba (20 giải)
- **Đối tượng**: Chỉ khách mời bên ngoài (`LoaiDS: "kh"`)
- **Số lần quay**: 20 lần
- **Người có giải fix**: Được phân bố đều trong 20 lần quay

### Giải Nhì (10 giải)
- **Đối tượng**: Chỉ khách mời bên ngoài (`LoaiDS: "kh"`)
- **Số lần quay**: 10 lần
- **Người có giải fix**: Được phân bố đều trong 10 lần quay

### Giải Nhất (15 giải)
- **Đối tượng**: Cả nhân viên bệnh viện và khách mời (`LoaiDS: "nv"` hoặc `"kh"`)
- **Số lần quay**: 15 lần
- **Người có giải fix**: Được phân bố đều trong 15 lần quay

### Giải Đặc Biệt (1 giải)
- **Đối tượng**: Chỉ nhân viên bệnh viện (`LoaiDS: "nv"`)
- **Số lần quay**: 1 lần
- **Ưu tiên**: Người có `GiaiFix: "db"`, nếu không có thì chọn ngẫu nhiên

## Cách sử dụng

### 1. Import các hàm cần thiết
```typescript
import { 
  quayChoNguoiTrungGiai, 
  quayTatCaGiai,
  getDanhSachThamGia,
  taoDataMau 
} from '@/lib/lottery-logic';
```

### 2. Quay số cho một lần cụ thể
```typescript
const danhSachNguoi = taoDataMau(); // Hoặc dữ liệu thực tế
const nguoiTrung = quayChoNguoiTrungGiai(
  danhSachNguoi,  // Danh sách người tham gia
  "3",            // Loại giải ("1", "2", "3", "db")
  0,              // Lần quay thứ (bắt đầu từ 0)
  20              // Tổng số lần quay cho loại giải này
);
```

### 3. Quay tất cả giải
```typescript
const danhSachNguoi = taoDataMau();
const ketQua = quayTatCaGiai(danhSachNguoi);

// ketQua = {
//   "3": [...],   // Danh sách người trúng giải ba
//   "2": [...],   // Danh sách người trúng giải nhì  
//   "1": [...],   // Danh sách người trúng giải nhất
//   "db": [...]   // Danh sách người trúng giải đặc biệt
// }
```

### 4. Lấy danh sách tham gia theo tiêu chí
```typescript
const danhSachKhachMoi = getDanhSachThamGia(
  danhSachNguoi,
  "3",        // Loại giải
  ["kh"]      // Chỉ khách mời
);

const danhSachTatCa = getDanhSachThamGia(
  danhSachNguoi,
  "1",        // Loại giải
  ["nv", "kh"] // Cả nhân viên và khách mời
);
```

## Tính năng đặc biệt

### Phân bố giải fix
- Người có `GiaiFix` được phân bố đều trong các lần quay để tạo tính chân thực
- Ví dụ: Giải ba có 20 lần quay, 5 người có giải fix → 5 người này sẽ trúng ở các lần quay khác nhau

### Loại bỏ người đã trúng
- Sau khi một người trúng giải, họ sẽ không tham gia các lần quay tiếp theo
- `GiaiTrung` được set thành id giải, `NgayQuaySo` được set thành thời gian hiện tại

### Thứ tự quay
Hệ thống quay theo thứ tự: **Giải Ba → Giải Nhì → Giải Nhất → Giải Đặc Biệt**

## Test và Demo

Chạy file demo để xem cách hoạt động:
```typescript
import './lottery-demo';
```

Hoặc test trực tiếp trong console:
```javascript
// Trong component React
const handleTestQuay = () => {
  const ketQua = quayTatCaGiai(DataThamGia);
  console.log("Kết quả:", ketQua);
};
```

## Lưu ý
- Dữ liệu mẫu trong `taoDataMau()` chỉ để test, thực tế cần load từ database
- Hệ thống đảm bảo công bằng với việc phân bố ngẫu nhiên cho người không có giải fix
- Tất cả logic đều được implement theo đúng yêu cầu nghiệp vụ
