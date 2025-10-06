"use client";

import { IDataUser } from "@/lib/lottery-logic";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";

interface IWinnersListProps {
  open: boolean;
  onClose: () => void;
  DataThamGia: IDataUser[];
}

export default function WinnersListDialog({
  open,
  onClose,
  DataThamGia,
}: IWinnersListProps) {
  const getStyleByGiai = (giai: string) => {
    switch (giai) {
      case "db":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-500";
      case "1":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400";
      case "2":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400";
      case "3":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400";
      default:
        return "bg-white border border-gray-200 text-gray-700";
    }
  };

  const getImageByGiai = (giai: string) => {
    switch (giai) {
      case "db":
        return "/cup-db.jpg";
      case "1":
        return "/cup-1.jpg";
      case "2":
        return "/cup-2.jpg";
      case "3":
        return "/cup-3.jpg";
      default:
        return "/cup-db.jpg";
    }
  };

  const getNameGiai = (giai: string) => {
    switch (giai) {
      case "db":
        return "Giải đặc biệt";
      case "1":
        return "Giải nhất";
      case "2":
        return "Giải nhì";
      case "3":
        return "Giải ba";
      default:
        return "";
    }
  };

  const winners = DataThamGia.filter((item) => item.GiaiTrung && !item.HuyBo);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen !max-w-full !max-h-screen p-0 rounded-none gap-0 !flex !flex-col">
        {/* Header */}
        <DialogHeader className="flex justify-between items-center bg-amber-500 p-4 !h-12">
          <DialogTitle className="text-white font-bold uppercase">
            Danh sách trúng thưởng
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-2 bg-black/90 h-full overflow-y-auto ">
          {(!winners || winners.length === 0) && (
            <div className="text-white text-center">Chưa có dữ liệu</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {winners.map((winner, index) => (
              <div
                key={index}
                className={`relative p-2 rounded-2xl flex flex-col items-center text-center ${getStyleByGiai(
                  winner.GiaiTrung || ""
                )}`}>
                <Image
                  className="rounded-full w-16 h-16 mb-2"
                  src={getImageByGiai(winner.GiaiTrung || "")}
                  width={64}
                  height={64}
                  alt="Cup"
                />
                <Label className="text-lg font-bold uppercase">
                  #{winner.Stt} - {winner.Hoten}
                </Label>
                <Label className="uppercase text-sm mt-1">
                  {getNameGiai(winner.GiaiTrung || "")}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
