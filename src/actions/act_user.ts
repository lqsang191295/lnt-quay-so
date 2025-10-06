import { post } from "@/api/client";
import { IDataUser } from "@/lib/lottery-logic";

export const act_DangKy = async (user: IDataUser) => {
  try {
    const response = await post(`/his/call`, {
      userId: "",
      optionId: "3",
      funcName: "dbo.QS_ins_KhachHang",
      paraData: [
        { paraName: "Hoten", paraValue: user.Hoten },
        { paraName: "NoiCongTac", paraValue: user.NoiCongTac },
        { paraName: "SoPhieu", paraValue: user.SoPhieu },
        { paraName: "LoaiDS", paraValue: user.LoaiDS },
        {
          paraName: "NgayTao",
          paraValue: user.NgayTao,
        },
        {
          paraName: "NgayThamDu",
          paraValue: user.NgayThamDu,
        },
        {
          paraName: "NgayQuaySo",
          paraValue: user.NgayQuaySo,
        },
        { paraName: "GiaiTrung", paraValue: user.GiaiTrung },
        { paraName: "GiaiFix", paraValue: user.GiaiFix },
        { paraName: "SoDienThoai", paraValue: user.SoDienThoai },
        { paraName: "HuyBo", paraValue: user.HuyBo },
        { paraName: "TrangThai", paraValue: user.TrangThai },
      ],
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

export const act_UpdateUser = async (user: IDataUser) => {
  try {
    const response = await post(`/his/call`, {
      userId: "",
      optionId: "3",
      funcName: "dbo.QS_upd_KhachHang",
      paraData: [
        { paraName: "Stt", paraValue: user.Stt },
        { paraName: "Hoten", paraValue: user.Hoten },
        { paraName: "NoiCongTac", paraValue: user.NoiCongTac },
        { paraName: "SoPhieu", paraValue: user.SoPhieu },
        { paraName: "LoaiDS", paraValue: user.LoaiDS },
        {
          paraName: "NgayTao",
          paraValue: user.NgayTao?.toString().replace("T", " "),
        },
        {
          paraName: "NgayThamDu",
          paraValue: user.NgayThamDu?.toString().replace("T", " "),
        },
        {
          paraName: "NgayQuaySo",
          paraValue: user.NgayQuaySo?.toString().replace("T", " "),
        },
        { paraName: "GiaiTrung", paraValue: user.GiaiTrung },
        { paraName: "GiaiFix", paraValue: user.GiaiFix },
        { paraName: "SoDienThoai", paraValue: user.SoDienThoai },
        { paraName: "HuyBo", paraValue: user.HuyBo },
        { paraName: "TrangThai", paraValue: user.TrangThai },
      ],
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
