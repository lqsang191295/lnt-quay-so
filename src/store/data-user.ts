import { IDataUser } from "@/lib/lottery-logic";
import { create } from "zustand";

interface iUserState {
  dataGiaiDb: IDataUser[];
  setDataGiaiDb: (data: IDataUser[]) => void;

  dataGiai1: IDataUser[];
  setDataGiai1: (data: IDataUser[]) => void;

  dataGiai2: IDataUser[];
  setDataGiai2: (data: IDataUser[]) => void;

  dataGiai3: IDataUser[];
  setDataGiai3: (data: IDataUser[]) => void;
}

export const useUserDataStore = create<iUserState>((set) => ({
  dataGiaiDb: [],
  setDataGiaiDb: (d) => set({ dataGiaiDb: d }),

  dataGiai1: [],
  setDataGiai1: (d) => set({ dataGiai1: d }),

  dataGiai2: [],
  setDataGiai2: (d) => set({ dataGiai2: d }),

  dataGiai3: [],
  setDataGiai3: (d) => set({ dataGiai3: d }),
}));
