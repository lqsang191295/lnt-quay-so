"use client";

import { IDataGiaiThuong, IDataUser } from "@/app/page";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Crown, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface WinnerModalProps {
  winner: IDataUser | null;
  isOpen: boolean;
  onClose: () => void;
  currGiaiThuong: IDataGiaiThuong;
  onNext: () => void;
  onCancel: () => void;
}

export default function WinnerModal({
  winner,
  isOpen,
  onClose,
  currGiaiThuong,
  onNext,
  onCancel,
}: WinnerModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (onNext) onNext();

    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();

    onClose();
  };

  if (!winner) return null;

  return (
    <Dialog open={isOpen}>
      <DialogContent className=" border-amber-400 max-w-2xl shadow-2xl">
        <div className="relative py-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-xl opacity-60 animate-glow-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce border-4 border-white">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <Image src="/congra.png" width={280} height={280} alt="Gift" />
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-amber-500 animate-sparkle" />
              <h2
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r 
                from-amber-600 via-yellow-500 to-amber-600 leading-normal">
                Chúc Mừng!
              </h2>
              <Star
                className="w-8 h-8 text-amber-500 animate-sparkle"
                style={{ animationDelay: "0.5s" }}
              />
            </div>

            <div className="space-y-5 flex flex-col justify-center items-center">
              <Label className="text-5xl font-bold text-purple-500">
                #{winner.Stt} - {winner.Hoten}
              </Label>
              <Label className="text-2xl font-bold text-purple-500">
                {currGiaiThuong.ten}
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleCancel}
                className="flex-1 cursor-pointer 
                bg-gradient-to-r from-yellow-500/20 to-orange-500/20   
              text-amber-600 border-2 border-amber-400 px-10 py-7 text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all mt-8">
                Huỷ bỏ
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 cursor-pointer 
                bg-gradient-to-r from-yellow-500/20 to-orange-500/20   
              text-amber-600 border-2 border-amber-400 px-10 py-7 text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all mt-8">
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
