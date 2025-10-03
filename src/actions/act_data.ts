import { post } from "@/api/client";
import { IDataUser } from "@/lib/lottery-logic";

const Mock_Data_Giai_Db = [
  {
    Stt: "3",
    Hoten: "Test thu 3",
    NoiCongTac: "Test noi cong tac 3",
    SoDienThoai: "3333333",
    NhanGiai: "",
  },
  {
    Stt: "4",
    Hoten: "Test thu 4",
    NoiCongTac: "Test noi cong tac 4",
    SoDienThoai: "4444444",
    NhanGiai: "",
  },
  {
    Stt: "5",
    Hoten: "Test thu 5",
    NoiCongTac: "Test noi cong tac 5",
    SoDienThoai: "5555555",
    NhanGiai: "",
  },
];

const Mock_Data_Giai_1 = [
  {
    Stt: "3",
    Hoten: "Test thu 3",
    NoiCongTac: "Test noi cong tac 3",
    SoDienThoai: "3333333",
    NhanGiai: "",
  },
  {
    Stt: "4",
    Hoten: "Test thu 4",
    NoiCongTac: "Test noi cong tac 4",
    SoDienThoai: "4444444",
    NhanGiai: "",
  },
  {
    Stt: "5",
    Hoten: "Test thu 5",
    NoiCongTac: "Test noi cong tac 5",
    SoDienThoai: "5555555",
    NhanGiai: "",
  },
];

const Mock_Data_Giai_2 = [
  {
    Stt: "3",
    Hoten: "Test thu 3",
    NoiCongTac: "Test noi cong tac 3",
    SoDienThoai: "3333333",
    NhanGiai: "",
  },
  {
    Stt: "4",
    Hoten: "Test thu 4",
    NoiCongTac: "Test noi cong tac 4",
    SoDienThoai: "4444444",
    NhanGiai: "",
  },
  {
    Stt: "5",
    Hoten: "Test thu 5",
    NoiCongTac: "Test noi cong tac 5",
    SoDienThoai: "5555555",
    NhanGiai: "",
  },
];

const Mock_Data_Giai_3 = [
  {
    Stt: "3",
    Hoten: "Test thu 3",
    NoiCongTac: "Test noi cong tac 3",
    SoDienThoai: "3333333",
    NhanGiai: "",
  },
  {
    Stt: "4",
    Hoten: "Test thu 4",
    NoiCongTac: "Test noi cong tac 4",
    SoDienThoai: "4444444",
    NhanGiai: "",
  },
  {
    Stt: "5",
    Hoten: "Test thu 5",
    NoiCongTac: "Test noi cong tac 5",
    SoDienThoai: "5555555",
    NhanGiai: "",
  },
];

const getDataGiaiServer = async (giai: string) => {
  let store = "";
  switch (giai) {
    case "db":
      store = "dbo.QS_get_giai_db";
    case "1":
      store = "dbo.QS_get_giai_1";
    case "2":
      store = "dbo.QS_get_giai_1";
    case "3":
      store = "dbo.QS_get_giai_1";
    default:
      store = "dbo.QS_get_data_tham_gia";
  }

  try {
    const response = await post(`/his/call`, {
      userId: "",
      optionId: "3",
      funcName: store,
      paraData: [],
    });

    console.log("response === ", response);

    if (response.status === "error") {
      return null;
    }

    return response.message;
  } catch {
    return null;
  }
};

const mockData = true;

export const getDataGiaiDb = async () => {
  if (mockData) return Mock_Data_Giai_Db;

  let data = getLocalStorageByKey("DATA_GIAI_DB");

  if (data) {
    return data;
  }

  data = await getDataGiaiServer("db");

  setLocalStorageByKey("DATA_GIAI_DB", data);

  return data;
};

export const getDataGiai1 = async () => {
  if (mockData) return Mock_Data_Giai_1;

  let data = getLocalStorageByKey("DATA_GIAI_1");

  if (data) {
    return data;
  }

  data = await getDataGiaiServer("1");

  setLocalStorageByKey("DATA_GIAI_1", data);

  return data;
};

export const getDataGiai2 = async () => {
  if (mockData) return Mock_Data_Giai_2;

  let data = getLocalStorageByKey("DATA_GIAI_2");

  if (data) {
    return data;
  }

  data = await getDataGiaiServer("2");

  setLocalStorageByKey("DATA_GIAI_2", data);

  return data;
};

export const getDataGiai3 = async () => {
  if (mockData) return Mock_Data_Giai_3;

  let data = getLocalStorageByKey("DATA_GIAI_3");

  if (data) {
    return data;
  }

  data = await getDataGiaiServer("3");

  setLocalStorageByKey("DATA_GIAI_3", data);

  return data;
};

const DataThamGia: IDataUser[] = [
  // Nhân viên bệnh viện
  {
    Stt: "1",
    Hoten: "Nguyễn Văn A",
    NoiCongTac: "Khoa Nội",
    SoDienThoai: "0901234567",
    SoPhieu: 1,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "db", // Người này sẽ trúng giải đặc biệt
  },
  {
    Stt: "2",
    Hoten: "Trần Thị B",
    NoiCongTac: "Khoa Ngoại",
    SoDienThoai: "0901234568",
    SoPhieu: 2,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "1", // Người này sẽ trúng giải nhất
  },
  {
    Stt: "3",
    Hoten: "Lê Văn C",
    NoiCongTac: "Khoa Sản",
    SoDienThoai: "0901234569",
    SoPhieu: 3,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: null,
  },
  {
    Stt: "4",
    Hoten: "Phạm Thị D",
    NoiCongTac: "Khoa Nhi",
    SoDienThoai: "0901234570",
    SoPhieu: 4,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "1", // Người này sẽ trúng giải nhất
  },
  // Khách mời bên ngoài
  {
    Stt: "5",
    Hoten: "Hoàng Văn E",
    NoiCongTac: "Công ty ABC",
    SoDienThoai: "0901234571",
    SoPhieu: 5,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "3", // Người này sẽ trúng giải ba
  },
  {
    Stt: "6",
    Hoten: "Vũ Thị F",
    NoiCongTac: "Công ty XYZ",
    SoDienThoai: "0901234572",
    SoPhieu: 6,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "2", // Người này sẽ trúng giải nhì
  },
  {
    Stt: "7",
    Hoten: "Đỗ Văn G",
    NoiCongTac: "Đối tác H",
    SoDienThoai: "0901234573",
    SoPhieu: 7,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "3", // Người này sẽ trúng giải ba
  },
  {
    Stt: "8",
    Hoten: "Bùi Thị H",
    NoiCongTac: "Liên đoàn I",
    SoDienThoai: "0901234574",
    SoPhieu: 8,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: null,
  },
];

export const getDataThamGia = async () => {
  if (mockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DataThamGia;
  }

  let data = getLocalStorageByKey("DATA_THAM_GIA");

  if (data) {
    return data;
  }

  data = await getDataGiaiServer("");

  setLocalStorageByKey("DATA_THAM_GIA", data);

  return data;
};
