"use client";

import { IDataUser } from "@/lib/lottery-logic";
import { FullscreenIcon, MinusIcon, PlusSquareIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
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
  const [zoom, setZoom] = useState(false);

  const getDataTrungGiai = () => {
    const order = ["db", "1", "2", "3"]; // thứ tự ưu tiên
    return DataThamGia.filter((item) => item.GiaiTrung && !item.HuyBo).sort(
      (a, b) =>
        order.indexOf(a.GiaiTrung || "") - order.indexOf(b.GiaiTrung || "")
    );
  };

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

  const winners = getDataTrungGiai();

  console.log("winners == ", winners);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex justify-between items-center bg-amber-500 p-2">
          <DialogTitle className="text-white font-semibold uppercase flex-1">
            Danh sách trúng thưởng
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setZoom((prev) => !prev)}>
              <FullscreenIcon />
            </Button>
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setZoom((prev) => !prev)}>
              {zoom ? <MinusIcon /> : <PlusSquareIcon />}
            </Button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div
          className={`flex flex-col gap-1 p-2 bg-black/50 overflow-y-auto max-h-[70vh] ${
            zoom ? "" : "hidden"
          }`}>
          {(!winners || winners.length === 0) && (
            <div className="text-white text-center">Chưa có dữ liệu</div>
          )}

          {winners &&
            winners.length > 0 &&
            winners.map((winner, index) => (
              <div
                key={index}
                className={`relative p-3 rounded-2xl ${getStyleByGiai(
                  winner.GiaiTrung || ""
                )}`}>
                <div className="flex items-center space-x-4">
                  <Image
                    className="rounded-full w-12 h-12"
                    src={getImageByGiai(winner.GiaiTrung || "")}
                    width={48}
                    height={48}
                    alt="Logo"
                  />
                  <div className="flex flex-col">
                    <div className="flex space-x-2 uppercase font-bold ">
                      <Label className="text-2xl font-bold">
                        #{winner.Stt}
                      </Label>
                      <Label className="text-2xl">-</Label>
                      <Label className="text-2xl font-bold">
                        {winner.Hoten}
                      </Label>
                    </div>
                    <Label className="uppercase text-xl">
                      {getNameGiai(winner.GiaiTrung || "")}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
