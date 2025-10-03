// Logic quay số cho hệ thống quay số may mắn

import { formatDate } from "./format";

export interface IDataUser {
  Stt: string;
  Hoten: string;
  NoiCongTac: string;
  SoDienThoai: string;
  SoPhieu: number | null;
  LoaiDS: string | null; // "nv": nhân viên bệnh viện, "kh": khách mời bên ngoài
  NgayTao: string | null;
  NgayThamDu: string | null;
  NgayQuaySo: string | null;
  GiaiTrung: string | null;
  GiaiFix: string | null; // id giải thưởng được chỉ định trước
  HuyBo?: boolean; // id giải thưởng được chỉ định trước
}

export interface IDataGiaiThuong {
  id: string;
  ten: string;
  sl: number;
}

// Quy tắc quay số theo từng loại giải
export const QUAT_QUY_QUAY_SO = {
  "3": {
    // Giải ba
    soLanQuay: 20,
    loaiDS: ["kh"], // Chỉ khách mời
    moTa: "Giải ba - 20 giải cho khách mời",
  },
  "2": {
    // Giải nhì
    soLanQuay: 10,
    loaiDS: ["kh"], // Chỉ khách mời
    moTa: "Giải nhì - 10 giải cho khách mời",
  },
  "1": {
    // Giải nhất
    soLanQuay: 15,
    loaiDS: ["nv", "kh"], // Cả nhân viên và khách mời
    moTa: "Giải nhất - 15 giải cho nhân viên và khách mời",
  },
  db: {
    // Giải đặc biệt
    soLanQuay: 1,
    loaiDS: ["nv"], // Chỉ nhân viên
    moTa: "Giải đặc biệt - 1 giải dành cho nhân viên",
  },
};

/**
 * Lấy danh sách người tham gia theo loại giải và loại danh sách
 * @param danhSachNguoi - Danh sách tất cả người tham gia
 * @param loaiGiai - Loại giải ("1", "2", "3", "db")
 * @param loaiDS - Mảng loại danh sách (["nv"], ["kh"], hoặc ["nv", "kh"])
 * @returns Danh sách người tham gia phù hợp
 */
export const getDanhSachThamGia = (
  danhSachNguoi: IDataUser[],
  loaiGiai: string,
  loaiDS?: string[]
): IDataUser[] => {
  // Lọc bỏ người đã trúng giải
  let filtered = danhSachNguoi.filter((user) => !user.GiaiTrung && !user.HuyBo);

  // Lọc theo loại danh sách nếu được chỉ định
  if (loaiDS && loaiDS.length > 0) {
    filtered = filtered.filter((user) => loaiDS.includes(user.LoaiDS || ""));
  }

  if (loaiGiai) {
    filtered = filtered.filter(
      (user) => user.GiaiFix === loaiGiai || !user.GiaiFix
    );
  }

  return filtered;
};

export const getDanhSachTrungGiai = (
  danhSachNguoi: IDataUser[],
  loaiGiai: string,
  loaiDS?: string[]
): IDataUser[] => {
  // Lọc bỏ người đã trúng giải
  let filtered = danhSachNguoi.filter(
    (user) => user.GiaiTrung === loaiGiai && !user.HuyBo
  );

  // Lọc theo loại danh sách nếu được chỉ định
  if (loaiDS && loaiDS.length > 0) {
    filtered = filtered.filter((user) => loaiDS.includes(user.LoaiDS || ""));
  }

  return filtered;
};

/**
 * Phân bố người có giải fix đều trong các lần quay để tạo tính chân thực
 * @param totalLanQuay - Tổng số lần quay
 * @param nguoiGiaiFix - Danh sách người có giải fix
 * @returns Mảng vị trí (lần quay) mà người giải fix sẽ trúng
 */
export const phanBoGiaiFix = (
  totalLanQuay: number,
  nguoiGiaiFix: IDataUser[]
): number[] => {
  if (nguoiGiaiFix.length === 0) return [];

  const viTriTrungGiai: number[] = [];
  const step = Math.floor(totalLanQuay / nguoiGiaiFix.length);

  for (let i = 0; i < nguoiGiaiFix.length; i++) {
    // Phân bố đều + thêm random để tạo tính chân thực
    const viTri = Math.min(
      totalLanQuay - 1,
      Math.floor(step * i + Math.random() * step)
    );
    viTriTrungGiai.push(viTri);
  }

  // Shuffle để random hóa thêm
  return viTriTrungGiai.sort(() => Math.random() - 0.5);
};

/**
 * Quay số để chọn người trúng giải cho một lần quay cụ thể
 * @param danhSachNguoi - Danh sách tất cả người tham gia
 * @param loaiGiai - Loại giải ("1", "2", "3", "db")
 * @param lanQuayThu - Lần quay thứ mấy (bắt đầu từ 0)
 * @param totalLanQuay - Tổng số lần quay cho loại giải này
 * @returns Người trúng giải hoặc null
 */
export const quayChoNguoiTrungGiai = (
  danhSachNguoi: IDataUser[],
  loaiGiai: string,
  lanQuayThu: number,
  totalLanQuay: number
): IDataUser | null => {
  const quyTac = QUAT_QUY_QUAY_SO[loaiGiai as keyof typeof QUAT_QUY_QUAY_SO];
  if (!quyTac) return null;

  // Lấy danh sách tham gia theo quy tắc
  const danhSachThamGia = getDanhSachThamGia(
    danhSachNguoi,
    loaiGiai,
    quyTac.loaiDS
  );

  if (danhSachThamGia.length === 0) return null;

  // Lấy danh sách người có giải fix cho loại giải này
  const nguoiGiaiFix = danhSachThamGia.filter(
    (user) => user.GiaiFix === loaiGiai
  );

  // Xử lý đặc biệt cho giải đặc biệt
  if (loaiGiai === "db") {
    // Ưu tiên người có GiaiFix, nếu không có thì chọn ngẫu nhiên
    if (nguoiGiaiFix.length > 0) {
      const nguoiTrung = nguoiGiaiFix[0];
      // nguoiTrung.GiaiTrung = loaiGiai;
      nguoiTrung.NgayQuaySo = formatDate(new Date());
      return nguoiTrung;
    }
  }

  // Phân bố người có giải fix
  const viTriGiaiFix = phanBoGiaiFix(totalLanQuay, nguoiGiaiFix);

  // Kiểm tra xem lần quay này có phải cho người giải fix không
  const indexGiaiFix = viTriGiaiFix.indexOf(lanQuayThu);

  if (indexGiaiFix !== -1 && nguoiGiaiFix.length > indexGiaiFix) {
    // Chọn người có giải fix
    const nguoiTrung = nguoiGiaiFix[indexGiaiFix];
    // nguoiTrung.GiaiTrung = loaiGiai;
    nguoiTrung.NgayQuaySo = formatDate(new Date());
    return nguoiTrung;
  } else {
    // Chọn ngẫu nhiên từ danh sách còn lại (loại bỏ người có giải fix đã được phân bổ)
    const danhSachNgauNhien = danhSachThamGia.filter(
      (user) => !user.GiaiFix || user.GiaiFix !== loaiGiai
    );

    if (danhSachNgauNhien.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * danhSachNgauNhien.length);
    const nguoiTrung = danhSachNgauNhien[randomIndex];
    // nguoiTrung.GiaiTrung = loaiGiai;
    nguoiTrung.NgayQuaySo = formatDate(new Date());
    return nguoiTrung;
  }
};

/**
 * Quay số cho tất cả các giải theo thứ tự: 3 -> 2 -> 1 -> db
 * @param danhSachNguoi - Danh sách tất cả người tham gia
 * @returns Kết quả quay số cho từng loại giải
 */
export const quayTatCaGiai = (
  danhSachNguoi: IDataUser[]
): { [key: string]: IDataUser[] } => {
  const ketQuaQuay: { [key: string]: IDataUser[] } = {
    "3": [],
    "2": [],
    "1": [],
    db: [],
  };

  // Reset trạng thái trúng giải
  danhSachNguoi.forEach((user) => {
    user.GiaiTrung = null;
    user.NgayQuaySo = null;
  });

  // Quay theo thứ tự: Giải ba -> Giải nhì -> Giải nhất -> Giải đặc biệt

  // Quay giải ba (20 lần)
  for (let i = 0; i < QUAT_QUY_QUAY_SO["3"].soLanQuay; i++) {
    const nguoiTrung = quayChoNguoiTrungGiai(
      danhSachNguoi,
      "3",
      i,
      QUAT_QUY_QUAY_SO["3"].soLanQuay
    );
    if (nguoiTrung) {
      ketQuaQuay["3"].push(nguoiTrung);
    }
  }

  // Quay giải nhì (10 lần)
  for (let i = 0; i < QUAT_QUY_QUAY_SO["2"].soLanQuay; i++) {
    const nguoiTrung = quayChoNguoiTrungGiai(
      danhSachNguoi,
      "2",
      i,
      QUAT_QUY_QUAY_SO["2"].soLanQuay
    );
    if (nguoiTrung) {
      ketQuaQuay["2"].push(nguoiTrung);
    }
  }

  // Quay giải nhất (15 lần)
  for (let i = 0; i < QUAT_QUY_QUAY_SO["1"].soLanQuay; i++) {
    const nguoiTrung = quayChoNguoiTrungGiai(
      danhSachNguoi,
      "1",
      i,
      QUAT_QUY_QUAY_SO["1"].soLanQuay
    );
    if (nguoiTrung) {
      ketQuaQuay["1"].push(nguoiTrung);
    }
  }

  // Quay giải đặc biệt (1 lần)
  const nguoiTrungDB = quayChoNguoiTrungGiai(
    danhSachNguoi,
    "db",
    0,
    QUAT_QUY_QUAY_SO["db"].soLanQuay
  );
  if (nguoiTrungDB) {
    ketQuaQuay["db"].push(nguoiTrungDB);
  }

  return ketQuaQuay;
};

/**
 * Tạo danh sách người tham gia mẫu để test
 * @returns Danh sách người tham gia mẫu
 */
export const taoDataMau = (): IDataUser[] => {
  const dataMau: IDataUser[] = [];

  // Tạo nhân viên bệnh viện
  for (let i = 1; i <= 50; i++) {
    dataMau.push({
      Stt: `NV${i.toString().padStart(3, "0")}`,
      Hoten: `Nhân viên ${i}`,
      NoiCongTac: `Khoa ${Math.ceil(i / 10)}`,
      SoDienThoai: `090${i.toString().padStart(7, "0")}`,
      SoPhieu: i,
      LoaiDS: "nv",
      NgayTao: formatDate(new Date()),
      NgayThamDu: formatDate(new Date()),
      NgayQuaySo: null,
      GiaiTrung: null,
      GiaiFix: i <= 3 ? (i === 1 ? "db" : "1") : null, // 1 người trúng DB, 2 người trúng giải 1
    });
  }

  // Tạo khách mời
  for (let i = 1; i <= 100; i++) {
    dataMau.push({
      Stt: `KH${i.toString().padStart(3, "0")}`,
      Hoten: `Khách mời ${i}`,
      NoiCongTac: `Đối tác ${Math.ceil(i / 20)}`,
      SoDienThoai: `091${i.toString().padStart(7, "0")}`,
      SoPhieu: 50 + i,
      LoaiDS: "kh",
      NgayTao: formatDate(new Date()),
      NgayThamDu: formatDate(new Date()),
      NgayQuaySo: null,
      GiaiTrung: null,
      GiaiFix: i <= 8 ? (i <= 3 ? "3" : i <= 6 ? "2" : "1") : null, // 3 người giải 3, 3 người giải 2, 2 người giải 1
    });
  }

  return dataMau;
};
