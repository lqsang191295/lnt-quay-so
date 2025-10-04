"use client";
import { IDataUser } from "@/lib/lottery-logic";
import { FullscreenIcon, MinusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface IWinnersListProps {
  DataThamGia: IDataUser[];
}

export default function WinnersList({ DataThamGia }: IWinnersListProps) {
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

  return (
    <div
      className="rounded-2xl overflow-hidden border border-amber-500 flex flex-col"
      style={{
        maxHeight: "88vh",
      }}>
      <div
        className={`flex flex-col gap-1 p-1 bg-black/50 overflow-y-scroll overflow-x-hidden hide-scrollbar flex-1 ${
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
                    <Label className="text-2xl font-bold">#{winner.Stt}</Label>
                    <Label className="text-2xl">-</Label>
                    <Label className="text-2xl font-bold">{winner.Hoten}</Label>
                  </div>
                  <Label className="uppercase text-xl">
                    {getNameGiai(winner.GiaiTrung || "")}
                  </Label>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="p-2 flex justify-center items-center bg-amber-500 gap-1">
        <Label className="text-white font-semibold uppercase flex-1">
          Danh sách trúng thưởng
        </Label>
        <Button
          variant="ghost"
          className="cursor-pointer ml-4"
          onClick={() => setZoom((prev) => !prev)}>
          <FullscreenIcon />
        </Button>
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => setZoom((prev) => !prev)}>
          <MinusIcon />
        </Button>
      </div>
    </div>
  );
}
