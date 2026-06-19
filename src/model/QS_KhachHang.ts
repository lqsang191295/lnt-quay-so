export interface IQS_KhachHang {
  Stt?: number | null;
  Hoten: string;
  NoiCongTac: string;
  SoPhieu: number;
  LoaiDS: string;
  NgayTao: string | null;
  NgayThamDu: string | null;
  NgayQuaySo: string | null;
  GiaiTrung: string;
  GiaiFix: string;
  SoDienThoai: string;
  HuyBo: boolean;
  TrangThai: number;
}

export const DefaultQS_KhachHang: IQS_KhachHang = {
  Stt: null,
  Hoten: "",
  NoiCongTac: "",
  SoPhieu: 0,
  LoaiDS: "",
  NgayTao: null,
  NgayThamDu: null,
  NgayQuaySo: null,
  GiaiTrung: "",
  GiaiFix: "",
  SoDienThoai: "",
  HuyBo: false,
  TrangThai: 0,
};
