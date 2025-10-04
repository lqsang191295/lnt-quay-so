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
      store = "dbo.QS_get_KhachHang";
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

export const getDataThamGia = async () => {
  const data = await getDataGiaiServer("");

  return shuffleArray<IDataUser>(data);
};

export function shuffleArray<T>(array: T[]): T[] {
  if (!array || array.length === 0) return [];

  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
