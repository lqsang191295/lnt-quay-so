"use client";

import SlotMachine from "@/components/SlotMachine";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WinnerModal from "@/components/winner-modal";
import WinnersList from "@/components/WinnersList";
import {
  IDataGiaiThuong,
  IDataUser,
  getDanhSachThamGia,
  quayChoNguoiTrungGiai,
  quayTatCaGiai,
} from "@/lib/lottery-logic";
import { ShieldUserIcon, Trophy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const DataInitGiaiThuong: IDataGiaiThuong[] = [
  { id: "db", ten: "Giải đặc biệt", sl: 1 },
  { id: "1", ten: "Giải nhất", sl: 15 },
  { id: "2", ten: "Giải nhì", sl: 10 },
  { id: "3", ten: "Giải ba", sl: 20 },
];

// Danh sách tham gia cho từng loại giải
const DataThamGia: IDataUser[] = [
  // Nhân viên bệnh viện
  {
    Stt: "1",
    Hoten: "Nguyễn Văn A",
    NoiCongTac: "Khoa Nội",
    SoDienThoai: "0901234567",
    SoPhieu: 1,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "db", // Người này sẽ trúng giải đặc biệt
  },
  {
    Stt: "2",
    Hoten: "Trần Thị B",
    NoiCongTac: "Khoa Ngoại",
    SoDienThoai: "0901234568",
    SoPhieu: 2,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "1", // Người này sẽ trúng giải nhất
  },
  {
    Stt: "3",
    Hoten: "Lê Văn C",
    NoiCongTac: "Khoa Sản",
    SoDienThoai: "0901234569",
    SoPhieu: 3,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: null,
  },
  {
    Stt: "4",
    Hoten: "Phạm Thị D",
    NoiCongTac: "Khoa Nhi",
    SoDienThoai: "0901234570",
    SoPhieu: 4,
    LoaiDS: "nv",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "1", // Người này sẽ trúng giải nhất
  },
  // Khách mời bên ngoài
  {
    Stt: "5",
    Hoten: "Hoàng Văn E",
    NoiCongTac: "Công ty ABC",
    SoDienThoai: "0901234571",
    SoPhieu: 5,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "3", // Người này sẽ trúng giải ba
  },
  {
    Stt: "6",
    Hoten: "Vũ Thị F",
    NoiCongTac: "Công ty XYZ",
    SoDienThoai: "0901234572",
    SoPhieu: 6,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "2", // Người này sẽ trúng giải nhì
  },
  {
    Stt: "7",
    Hoten: "Đỗ Văn G",
    NoiCongTac: "Đối tác H",
    SoDienThoai: "0901234573",
    SoPhieu: 7,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: "3", // Người này sẽ trúng giải ba
  },
  {
    Stt: "8",
    Hoten: "Bùi Thị H",
    NoiCongTac: "Liên đoàn I",
    SoDienThoai: "0901234574",
    SoPhieu: 8,
    LoaiDS: "kh",
    NgayTao: new Date(),
    NgayThamDu: new Date(),
    NgayQuaySo: null,
    GiaiTrung: null,
    GiaiFix: null,
  },
];

export default function LotteryDraw() {
  const [slGiai, setSlGiai] = useState(DataInitGiaiThuong[3].sl);
  const [dataGiaiThuong] = useState(DataInitGiaiThuong);
  const [idxGiaiThuong, setIdxGiaiThuong] = useState(0);
  const [currGiaiThuong, setCurrGiaiThuong] = useState(DataInitGiaiThuong[3]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState<IDataUser | null>(null);
  const [participants] = useState(DataThamGia.length);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Hàm quay số cho một lần quay cụ thể
  const quayMotLan = (
    loaiGiai: string,
    lanQuayThu: number
  ): IDataUser | null => {
    const totalLanQuay =
      DataInitGiaiThuong.find((g) => g.id === loaiGiai)?.sl || 1;
    return quayChoNguoiTrungGiai(
      DataThamGia,
      loaiGiai,
      lanQuayThu,
      totalLanQuay
    );
  };

  const getDataTrungThuong = (): IDataUser[] => {
    // Trả về danh sách người tham gia theo loại giải
    let data;
    switch (currGiaiThuong.id) {
      case "3": // Giải ba - chỉ khách mời
        data = getDanhSachThamGia(DataThamGia, currGiaiThuong.id, ["kh"]);
      case "2": // Giải nhì - chỉ khách mời
        data = getDanhSachThamGia(DataThamGia, currGiaiThuong.id, ["kh"]);
      case "1": // Giải nhất - cả nhân viên và khách mời
        data = getDanhSachThamGia(DataThamGia, currGiaiThuong.id, ["nv", "kh"]);
      case "db": // Giải đặc biệt - chỉ nhân viên
        data = getDanhSachThamGia(DataThamGia, currGiaiThuong.id, ["nv"]);
      default:
        data = getDanhSachThamGia(DataThamGia, currGiaiThuong.id, ["nv", "kh"]);
    }

    console.log(
      "getDataTrungThuong === ",
      currGiaiThuong.id,
      idxGiaiThuong,
      data
    );

    return data;
  };

  const handleSpin = () => {
    setWinner(null);
  };

  const handleCompleteSpin = () => {
    const winner = getDataTrungThuong()[0];

    console.log("winner === ", winner);

    if (!winner) return;

    setShowWinnerModal(true);
    setWinner(winner);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleNext = () => {
    setSlGiai((prev) => prev - 1);
    setIdxGiaiThuong((prev) => prev + 1);

    DataThamGia.map((item) => {
      if (item.Stt === winner?.Stt) {
        item.GiaiTrung = currGiaiThuong.id;
      }
    });

    setShowWinnerModal(false);
  };

  const handleCancel = () => {
    DataThamGia.map((item) => {
      if (item.Stt === winner?.Stt) {
        item.GiaiTrung = currGiaiThuong.id;
        item.HuyBo = true;
      }
    });
    setShowWinnerModal(false);
  };

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
        <Image src={"/gift-3d.png"} width={48} height={48} alt="Gift" />
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
          className="text-6xl font-black text-amber-600 
  [text-shadow:_2px_2px_0_#b45309,3px_3px_0_#92400e,4px_4px_0_#78350f] leading-normal">
          Hội nghị khoa học kỹ thuật lần thứ X
        </Label>
      </div>
      <div className="relative z-10 px-4 py-8 h-full w-full flex justify-center items-center">
        <div className="w-6xl mx-auto text-center mb-8">
          <div className="text-center mb-8 animate-slide-up flex flex-col justify-center items-center">
            <Label
              className="uppercase text-5xl font-bold text-accent mb-2"
              style={{ textShadow: "0 0 20px rgba(255, 215, 0, 0.8)" }}>
              Hệ Thống Quay Số May Mắn
            </Label>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="mb-2 w-full flex justify-center items-center">
              <h2
                className="mb-1 md:mb-4 text-balance text-3xl font-bold tracking-tight 
            bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
            leading-normal
            bg-clip-text text-transparent uppercase">
                {currGiaiThuong.ten} - Còn lại {slGiai} lần quay
              </h2>
            </div>
            {/* Draw Display */}
            <div className="mb-8 w-full">
              <SlotMachine
                onSpin={handleSpin}
                onCompleteSpin={handleCompleteSpin}
                DataTrungThuong={getDataTrungThuong()[0]}
              />

              {/* Number Display */}
              {/* <div
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
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Button
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
              </Button> */}
            </div>
          </div>
        </div>
        {/* Chon giai */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 text-yellow-400">
            <div className="flex items-center gap-4">
              <div className="">
                <ShieldUserIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="pr-2">
                <p className="text-sm uppercase">Người tham gia</p>
                <p className="text-2xl font-bold">
                  {participants.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 text-purple-400">
            <div className="flex text-left items-center gap-4">
              <div className="">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <p className="text-sm uppercase">{currGiaiThuong.ten}</p>
                <p className="text-2xl font-bold">{currGiaiThuong.sl} giải</p>
              </div>
            </div>
          </div>
          <Select
            value={currGiaiThuong.id}
            onValueChange={(val) => {
              const found = dataGiaiThuong.find((g) => g.id === val);
              if (found) {
                setCurrGiaiThuong(found);
                setSlGiai(found.sl);
                setIdxGiaiThuong(0); // Reset về lần quay đầu tiên
              }
            }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn giải" />
            </SelectTrigger>
            <SelectContent>
              {dataGiaiThuong.map((item) => (
                <SelectItem value={item.id} key={item.id} className="bg-white">
                  <Label>
                    {item.sl} - {item.ten}
                  </Label>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Nút test quay tất cả giải */}
          <button
            onClick={() => {
              const ketQua = quayTatCaGiai(DataThamGia);
              console.log("Kết quả quay tất cả giải:", ketQua);
              alert("Xem kết quả trong Console (F12)");
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            Test Quay Tất Cả
          </button>
        </div>

        {/* Data stas */}

        {/* List trung thuong */}
        <div className="absolute bottom-2 right-2">
          <WinnersList DataThamGia={DataThamGia} />
        </div>

        {/* Winner modal */}
        <WinnerModal
          winner={winner}
          currGiaiThuong={currGiaiThuong}
          isOpen={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          onNext={handleNext}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
