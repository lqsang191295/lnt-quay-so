"use client";
import Image from "next/image";
import { useState } from "react";
import { Label } from "./ui/label";

export default function WinnersList() {
  const [winners, setWinners] = useState<Record<string, string>[]>([
    { Ma: "001", Ten: "Nguyễn Văn A", Giai: "Giải Đặc Biệt" },
    { Ma: "002", Ten: "Trần Thị B", Giai: "Giải Nhất" },
    { Ma: "003", Ten: "Lê Văn C", Giai: "Giải Nhì" },
    { Ma: "004", Ten: "Phạm Văn D", Giai: "Giải Ba" },
  ]);

  const getStyleByGiai = (giai: string) => {
    switch (giai) {
      case "Giải Đặc Biệt":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-500";
      case "Giải Nhất":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400";
      case "Giải Nhì":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400";
      case "Giải Ba":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400";
      default:
        return "bg-white border border-gray-200 text-gray-700";
    }
  };

  const getImageByGiai = (giai: string) => {
    switch (giai) {
      case "Giải Đặc Biệt":
        return "/cup-db.jpg";
      case "Giải Nhất":
        return "/cup-1.jpg";
      case "Giải Nhì":
        return "/cup-2.jpg";
      case "Giải Ba":
        return "/cup-3.jpg";
      default:
        return "/cup-db.jpg";
    }
  };

  return (
    <div className="rounded-2xl z-50 overflow-hidden border border-amber-500">
      <div className="flex flex-col gap-2 p-2 bg-black/50">
        {winners.map((winner, index) => (
          <div
            key={index}
            className={`relative p-3 rounded-2xl ${getStyleByGiai(
              winner.Giai
            )}`}>
            <div className="flex items-center space-x-4">
              <Image
                className="rounded-full w-12 h-12"
                src={getImageByGiai(winner.Giai)}
                width={48}
                height={48}
                alt="Logo"
              />
              <div className="flex flex-col">
                <div className="flex space-x-2 uppercase font-bold">
                  <Label className="text-lg font-bold">#{winner.Ma}</Label>
                  <Label className="text-lg">-</Label>
                  <Label className="text-lg font-semibold">{winner.Ten}</Label>
                </div>
                <Label className="font-bold">{winner.Giai}</Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 flex justify-center items-center bg-amber-500">
        <Label className="text-white font-semibold">
          Danh sách trúng thưởng
        </Label>
      </div>
    </div>
  );
}
