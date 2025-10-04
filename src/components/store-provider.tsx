"use client";

import { getDanhSachThamGia, IDataUser } from "@/lib/lottery-logic";
import { useUserDataStore } from "@/store/data-user";
import { useCallback, useEffect } from "react";

export default function StoreProvider({
  children,
  dataThamGia,
}: {
  children: React.ReactNode;
  dataThamGia: IDataUser[];
}) {
  const {
    setDataThamGia,
    setDataGiai1,
    setDataGiai2,
    setDataGiai3,
    setDataGiaiDb,
  } = useUserDataStore();

  const getDataTrungThuong = useCallback(
    (giai: string): IDataUser[] | null => {
      // Trả về danh sách người tham gia theo loại giải
      let data;
      switch (giai) {
        case "3": // Giải ba - chỉ khách mời
          data = getDanhSachThamGia(dataThamGia, "3", ["kh"]);
          break;
        case "2": // Giải nhì - chỉ khách mời
          data = getDanhSachThamGia(dataThamGia, "2", ["kh"]);
          break;
        case "1": // Giải nhất - cả nhân viên và khách mời
          data = getDanhSachThamGia(dataThamGia, "1", ["nv", "kh"]);
          break;
        case "db": // Giải đặc biệt - chỉ nhân viên
          data = getDanhSachThamGia(dataThamGia, "db", ["nv"]);
          break;
        default:
          data = null;
      }

      return data;
    },
    [dataThamGia]
  );

  useEffect(() => {
    if (!dataThamGia) return;

    const data = getDataTrungThuong("1");

    if (!data) return;

    setDataGiai1(data);
  }, [dataThamGia, setDataGiai1, getDataTrungThuong]);

  useEffect(() => {
    if (!dataThamGia) return;

    const data = getDataTrungThuong("2");

    if (!data) return;

    setDataGiai2(data);
  }, [dataThamGia, setDataGiai2, getDataTrungThuong]);

  useEffect(() => {
    if (!dataThamGia) return;

    const data = getDataTrungThuong("3");

    if (!data) return;

    setDataGiai3(data);
  }, [dataThamGia, setDataGiai3, getDataTrungThuong]);

  useEffect(() => {
    if (!dataThamGia) return;

    const data = getDataTrungThuong("db");

    if (!data) return;

    setDataGiaiDb(data);
  }, [dataThamGia, setDataGiaiDb, getDataTrungThuong]);

  useEffect(() => {
    if (!dataThamGia) return;

    setDataThamGia(dataThamGia);
  }, [dataThamGia, setDataThamGia]);

  return <>{children}</>;
}
