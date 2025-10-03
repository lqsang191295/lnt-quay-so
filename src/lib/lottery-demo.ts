// Demo và test hệ thống quay số may mắn
import { 
  quayTatCaGiai, 
  taoDataMau, 
  quayChoNguoiTrungGiai,
  QUAT_QUY_QUAY_SO 
} from './lottery-logic';

// Test với dữ liệu mẫu
console.log('=== DEMO HỆ THỐNG QUAY SỐ MAY MẮN ===\n');

// Tạo dữ liệu mẫu
const danhSachNguoi = taoDataMau();
console.log(`Tổng số người tham gia: ${danhSachNguoi.length}`);
console.log(`- Nhân viên bệnh viện: ${danhSachNguoi.filter(u => u.LoaiDS === 'nv').length}`);
console.log(`- Khách mời: ${danhSachNguoi.filter(u => u.LoaiDS === 'kh').length}`);
console.log(`- Người có giải fix: ${danhSachNguoi.filter(u => u.GiaiFix).length}\n`);

// Hiển thị quy tắc quay số
console.log('=== QUY TẮC QUAY SỐ ===');
Object.entries(QUAT_QUY_QUAY_SO).forEach(([key, value]) => {
  console.log(`${key.toUpperCase()}: ${value.moTa}`);
});
console.log('');

// Test quay từng giải
console.log('=== TEST QUAY TỪNG GIẢI ===');

// Test giải ba
console.log('--- Quay Giải Ba ---');
for (let i = 0; i < 3; i++) {
  const nguoiTrung = quayChoNguoiTrungGiai(danhSachNguoi, "3", i, 20);
  if (nguoiTrung) {
    console.log(`Lần ${i + 1}: ${nguoiTrung.Hoten} (${nguoiTrung.LoaiDS}) - ${nguoiTrung.GiaiFix ? 'Giải fix' : 'Ngẫu nhiên'}`);
  }
}

// Reset để test giải khác
danhSachNguoi.forEach(user => {
  user.GiaiTrung = null;
  user.NgayQuaySo = null;
});

// Test quay tất cả giải
console.log('\n=== TEST QUAY TẤT CẢ GIẢI ===');
const ketQua = quayTatCaGiai([...danhSachNguoi]); // Clone array để không thay đổi original

console.log('Kết quả chi tiết:');
Object.entries(ketQua).forEach(([loaiGiai, danhSach]) => {
  const tenGiai = {
    'db': 'Giải Đặc Biệt',
    '1': 'Giải Nhất', 
    '2': 'Giải Nhì',
    '3': 'Giải Ba'
  }[loaiGiai] || loaiGiai;
  
  console.log(`\n${tenGiai} (${danhSach.length} người):`);
  danhSach.forEach((nguoi, index) => {
    console.log(`  ${index + 1}. ${nguoi.Hoten} - ${nguoi.NoiCongTac} (${nguoi.LoaiDS}) ${nguoi.GiaiFix ? '[Fix]' : ''}`);
  });
});

// Thống kê
console.log('\n=== THỐNG KÊ ===');
const tongNguoiTrung = Object.values(ketQua).reduce((sum, arr) => sum + arr.length, 0);
console.log(`Tổng số người trúng giải: ${tongNguoiTrung}`);

Object.entries(ketQua).forEach(([loaiGiai, danhSach]) => {
  const nguoiGiaiFix = danhSach.filter(n => n.GiaiFix === loaiGiai).length;
  const nguoiNgauNhien = danhSach.length - nguoiGiaiFix;
  console.log(`${loaiGiai.toUpperCase()}: ${nguoiGiaiFix} fix + ${nguoiNgauNhien} ngẫu nhiên = ${danhSach.length} tổng`);
});

export { danhSachNguoi, ketQua };
