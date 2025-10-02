"use client";
import Image from "next/image";
import { useState } from "react";
import { Label } from "./ui/label";

export default function WinnersList() {
  const [winners, setWinners] = useState<Record<string, string>[]>([
    { Ma: "001", Ten: "Nguyễn Văn A", Giai: "Giải Nhất" },
    { Ma: "002", Ten: "Trần Thị B", Giai: "Giải Nhì" },
    { Ma: "003", Ten: "Lê Văn C", Giai: "Giải Ba" },
    { Ma: "004", Ten: "Phạm Văn D", Giai: "Giải Khuyến Khích" },
  ]);

  return (
    <div className="rounded-2xl z-50 overflow-hidden border-1 border-amber-500 ">
      <div className="flex flex-col gap-1 p-2">
        {winners.map((winner, index) => (
          <div key={index} className="relative bg-white p-2 rounded-2xl">
            <div className="flex items-center space-x-4">
              <Image
                className=""
                src={"/trophy-star.png"}
                width={48}
                height={48}
                alt="Logo"
              />
              <div className="flex flex-col">
                <div className="flex space-x-2 ">
                  <Label className="text-lg">#{winner.Ma}</Label>
                  <Label className="text-lg">{winner.Ten}</Label>
                </div>
                <Label className="text-orange-500">{winner.Giai}</Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 flex justify-center items-center bg-amber-500">
        <Label>Danh sách trúng thưởng</Label>
      </div>
    </div>
  );
}
