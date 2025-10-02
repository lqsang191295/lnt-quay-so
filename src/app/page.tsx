"use client";

import SlotMachine from "@/components/SlotMachine";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WinnersList from "@/components/WinnersList";
import { ShieldUserIcon, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LotteryDraw() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 3,
    minutes: 12,
    seconds: 48,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [participants, setParticipants] = useState(1247);
  const [currentNumber, setCurrentNumber] = useState("000000");

  useEffect(() => {
    const timer = setInterval(() => {
      // setCountdown((prev) => {
      //   let { hours, minutes, seconds } = prev;
      //   if (seconds > 0) {
      //     seconds--;
      //   } else if (minutes > 0) {
      //     minutes--;
      //     seconds = 59;
      //   } else if (hours > 0) {
      //     hours--;
      //     minutes = 59;
      //     seconds = 59;
      //   }
      //   return { hours, minutes, seconds };
      // });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDrawing) {
      const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
        setCurrentNumber(randomNum);
      }, 50);

      // Stop after 3 seconds and show winner
      const timeout = setTimeout(() => {
        clearInterval(interval);
        const finalNumber = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
        setCurrentNumber(finalNumber);
        setWinner(finalNumber);
        setIsDrawing(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isDrawing]);

  const handleDraw = () => {
    setWinner(null);
    setShowConfetti(false);
    setIsDrawing(true);
  };

  const handleReset = () => {
    setWinner(null);
    setCurrentNumber("000000");
    setShowConfetti(false);
  };

  console.log("xxxx");

  return (
    <div
      className="relative w-screen h-screen flex flex-col justify-center items-center
    bg-gradient-to-br from-[#0f1729] via-[#1a2847] to-[#0f1729] overflow-hidden">
      <div className="absolute top-20 left-[10%] w-16 h-16 animate-float opacity-60">
        <Image src={"/gift-3d.png"} width={48} height={48} alt="Gift" />
      </div>

      <div
        className="absolute top-40 right-[15%] w-12 h-12 animate-float-slow opacity-50"
        style={{ animationDelay: "1s" }}>
        <Image src={"/balloons-3d.png"} width={120} height={120} alt="Gift" />
      </div>

      <div className="absolute top-[30%] left-[8%] w-14 h-14 animate-float opacity-80">
        <Image src={"/coin-3d.png"} width={120} height={120} alt="Gift" />
      </div>

      <div
        className="absolute bottom-[25%] right-[12%] w-12 h-12 animate-float-slow opacity-70"
        style={{ animationDelay: "0.5s" }}>
        <Image src={"/coin-3d.png"} width={120} height={120} alt="Gift" />
      </div>

      <div
        className="absolute top-[60%] left-[15%] w-10 h-10 animate-float opacity-60"
        style={{ animationDelay: "1.5s" }}>
        <Image src={"/coin-3d.png"} width={120} height={120} alt="Gift" />
      </div>

      <div
        className="absolute top-[50%] right-[8%] w-16 h-16 animate-float-slow opacity-70"
        style={{ animationDelay: "0.8s" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400">
          <path
            d="M50 10 L80 40 L70 80 L30 80 L20 40 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <path d="M50 10 L80 40 L50 50 Z" fill="currentColor" opacity="0.6" />
          <path d="M20 40 L50 50 L30 80 Z" fill="currentColor" opacity="0.9" />
        </svg>
      </div>

      <div
        className="absolute bottom-[40%] left-[20%] w-12 h-12 animate-float opacity-60"
        style={{ animationDelay: "2s" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400">
          <path
            d="M50 10 L80 40 L70 80 L30 80 L20 40 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <path d="M50 10 L80 40 L50 50 Z" fill="currentColor" opacity="0.6" />
          <path d="M20 40 L50 50 L30 80 Z" fill="currentColor" opacity="0.9" />
        </svg>
      </div>

      <div className="absolute top-[25%] right-[25%] w-8 h-8 animate-spin-slow opacity-70">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
          <path
            d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-[30%] right-[30%] w-6 h-6 animate-spin-slow opacity-60"
        style={{ animationDelay: "1s" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-300">
          <path
            d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                backgroundColor: ["#3b82f6", "#fbbf24", "#ec4899", "#10b981"][
                  Math.floor(Math.random() * 4)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="w-full flex justify-center items-center bg-[#ffffff20]">
        <Label
          className="uppercase text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 not-visited:text-balance tracking-tight
              leading-normal">
          Hội nghị khoa học kỹ thuật lần thứ X
        </Label>
      </div>
      <div className="relative z-10 px-4 py-8 h-full w-full flex justify-center items-center">
        <div className="w-6xl mx-auto text-center mb-8">
          <div className="text-center mb-8 animate-slide-up flex flex-col justify-center items-center">
            <Label
              className="uppercase text-6xl font-bold text-accent mb-2"
              style={{ textShadow: "0 0 20px rgba(255, 215, 0, 0.8)" }}>
              Hệ Thống Quay Số May Mắn
            </Label>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
            text-white font-bold px-12 py-6 text-lg hover:shadow-lg transition-shadow
            rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-1 bg-emerald-100 rounded-xl">
                  <ShieldUserIcon className="w-12 h-12 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm">Người tham gia</p>
                  <p className="text-2xl font-bold">
                    {participants.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
            text-white font-bold px-12 py-6 text-lg hover:shadow-lg transition-shadow
            rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm ">Giải đặc biệt</p>
                  <p className="text-2xl font-bold">1 giải</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Draw Display */}
            <div className="mb-8">
              <SlotMachine />

              {/* Number Display */}
              <div
                className={`relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 md:p-12 ${
                  isDrawing ? "animate-glow" : ""
                } ${winner ? "ring-4 ring-amber-400 ring-offset-4" : ""}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-2xl" />
                <div className="relative flex justify-center items-center gap-2 md:gap-4">
                  {currentNumber.split("").map((digit, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl w-12 h-16 md:w-16 md:h-20 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}>
                      <span className="text-3xl md:text-5xl font-bold text-emerald-700">
                        {digit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {winner && (
                <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-lg">
                      Chúc mừng người chiến thắng!
                    </span>
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleDraw}
                disabled={isDrawing}
                className="cursor-pointer bg-gradient-to-r uppercase
                  from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-24 py-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                {isDrawing ? (
                  <>
                    <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin " />
                    <Label className="text-2xl">Đang quay...</Label>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-18 h-18" />
                    <Label className="text-2xl">Bắt đầu</Label>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Chon giai */}
        <div className="absolute bottom-2 left-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn giải" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Giải đặc biệt</SelectItem>
              <SelectItem value="dark">Giải nhất</SelectItem>
              <SelectItem value="system">Giải nhì</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* List trung thuong */}
        <div className="absolute bottom-2 right-2">
          <WinnersList />
        </div>
      </div>
    </div>
  );
}
