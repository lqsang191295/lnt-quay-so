"use client";

import { IDataUser } from "@/lib/lottery-logic";
import { useUserDataStore } from "@/store/data-user";
import { useEffect } from "react";

export default function StoreProvider({
  children,
  dataThamGia,
}: {
  children: React.ReactNode;
  dataThamGia: IDataUser[] | null;
}) {
  const { setDataThamGia } = useUserDataStore();

  useEffect(() => {
    if (!dataThamGia) return;

    setDataThamGia(dataThamGia);
  }, [dataThamGia, setDataThamGia]);

  return <>{children}</>;
}
