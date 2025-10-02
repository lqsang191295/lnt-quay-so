import { post } from "@/api/client";

export const act_DangKy = async (
  Hoten: string,
  NoiCongTac: string,
  SoPhieu: string,
  LoaiDS: string,
  NgayTao: string,
  NgayThamDu: string,
  NgayQuaySo: string,
  GiaiTrung: string,
  GiaiFix: string,
  SoDienThoai: string
) => {
  try {
    const response = await post(`/his/call`, {
      userId: "",
      optionId: "3",
      funcName: "dbo.QS_ins_KhachHang",
      paraData: [
        { paraName: "Hoten", paraValue: Hoten },
        { paraName: "NoiCongTac", paraValue: NoiCongTac },
        { paraName: "SoPhieu", paraValue: SoPhieu },
        { paraName: "LoaiDS", paraValue: LoaiDS },
        { paraName: "NgayTao", paraValue: NgayTao },
        { paraName: "NgayThamDu", paraValue: NgayThamDu },
        { paraName: "NgayQuaySo", paraValue: NgayQuaySo },
        { paraName: "GiaiTrung", paraValue: GiaiTrung },
        { paraName: "GiaiFix", paraValue: GiaiFix },
        { paraName: "SoDienThoai", paraValue: SoDienThoai },
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
