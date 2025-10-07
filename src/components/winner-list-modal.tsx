"use client";

import { IDataUser } from "@/lib/lottery-logic";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

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
  
  // Tính toán pagination
  const totalPages = Math.ceil(winners.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWinners = winners.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[70vw] !max-h-fit !top-[47vh] !transform !-translate-y-1/2 p-0 rounded-lg gap-0 !flex !flex-col">
        {/* Header */}
        <div className="bg-amber-500 p-4 rounded-t-lg">
          <h2 className="text-white font-bold uppercase text-xl text-center">
            DANH SÁCH TRÚNG THƯỞNG
          </h2>
        </div>

        {/* Body */}
        <div className="p-4 bg-black/90 flex flex-col rounded-b-lg">
          {(!winners || winners.length === 0) && (
            <div className="text-white text-center">Chưa có dữ liệu</div>
          )}

          {winners.length > 0 && (
            <>
              {/* Winners list with navigation buttons */}
              <div className="flex items-center gap-4 group">
                {/* Back button */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={handlePrevPage}
                    variant="outline"
                    className={`bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white h-[620px] w-10 flex-col justify-center transition-opacity duration-300 px-1 ${
                      currentPage === 0 
                        ? 'opacity-0 pointer-events-none' 
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <span className="text-xl">←</span>
                    <span className="text-xs mt-1 transform rotate-90 whitespace-nowrap">Back</span>
                  </Button>
                </div>

                {/* Winners list */}
                <div className="flex-1 space-y-2" style={{ height: '630px' }}>
                {Array.from({ length: 10 }, (_, index) => {
                  const winner = currentWinners[index];
                  if (!winner) {
                    // Placeholder cho dòng trống
                    return (
                      <div key={`empty-${index}`} className="h-14 opacity-0">
                        <div className="flex items-center p-3 rounded-lg bg-transparent border border-transparent">
                          <div className="w-12 h-12 mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 mb-1"></div>
                            <div className="h-3"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 mb-1"></div>
                            <div className="h-3"></div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={startIndex + index}
                      className={`h-14 flex items-center p-3 rounded-lg ${getStyleByGiai(
                        winner.GiaiTrung || ""
                      )}`}>
                      <Image
                        className="rounded-full w-12 h-12 mr-4 flex-shrink-0"
                        src={getImageByGiai(winner.GiaiTrung || "")}
                        width={48}
                        height={48}
                        alt="Cup"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-bold truncate">
                          #{winner.Stt} - {winner.Hoten}
                        </div>
                        <div className="text-xs opacity-80 truncate">
                          {winner.NoiCongTac}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-base font-bold uppercase">
                          {getNameGiai(winner.GiaiTrung || "")}
                        </div>
                        <div className="text-xs opacity-80">
                          Số phiếu: {winner.SoPhieu}
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>

                {/* Next button */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={handleNextPage}
                    variant="outline"
                    className={`bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white h-[620px] w-10 flex-col justify-center transition-opacity duration-300 px-1 ${
                      currentPage >= totalPages - 1 
                        ? 'opacity-0 pointer-events-none' 
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <span className="text-xl">→</span>
                    <span className="text-xs mt-1 transform rotate-90 whitespace-nowrap">Next</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
