"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Award, Sparkles } from "lucide-react";
import Image from "next/image";

interface PrizeGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const prizes = [
  {
    id: "1",
    name: "Giải nhất",
    image: "/giai-thuong/giai-1.webp",
    accent: "from-amber-300 via-yellow-500 to-orange-500",
    glow: "shadow-yellow-400/30",
  },
  {
    id: "2",
    name: "Giải nhì",
    image: "/giai-thuong/giai-2.webp",
    accent: "from-cyan-300 via-blue-400 to-blue-600",
    glow: "shadow-blue-400/25",
  },
  {
    id: "3",
    name: "Giải ba",
    image: "/giai-thuong/giai-3.webp",
    accent: "from-orange-300 via-orange-500 to-amber-700",
    glow: "shadow-orange-400/25",
  },
];

export default function PrizeGalleryModal({
  open,
  onOpenChange,
}: PrizeGalleryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!h-[calc(100vh-2rem)] !w-[calc(100vw-2rem)] !max-w-none overflow-hidden border border-amber-300/40 bg-[radial-gradient(circle_at_top,#24365f_0%,#111c35_48%,#070d1d_100%)] p-0 text-white shadow-2xl">
        <div className="relative flex h-full flex-col overflow-y-auto px-6 py-8 md:px-10 lg:px-14">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#fbbf24_0,transparent_18%),radial-gradient(circle_at_80%_25%,#ec4899_0,transparent_16%),radial-gradient(circle_at_50%_100%,#3b82f6_0,transparent_25%)]" />

          <header className="relative z-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-3 text-amber-300">
              <Sparkles className="h-7 w-7" />
              <span className="text-sm font-bold uppercase tracking-[0.35em]">
                Cơ cấu giải thưởng
              </span>
              <Sparkles className="h-7 w-7" />
            </div>
            <DialogTitle className="bg-gradient-to-r from-pink-400 via-amber-300 to-orange-400 bg-clip-text text-4xl font-black uppercase leading-normal text-transparent md:text-6xl">
              Quà tặng may mắn
            </DialogTitle>
            <p className="mt-2 text-base text-blue-100/80 md:text-lg">
              Ba phần quà hấp dẫn dành cho những người tham dự may mắn nhất
            </p>
          </header>

          <div className="relative z-10 my-auto grid grid-cols-1 gap-5 py-7 md:grid-cols-3 lg:gap-8">
            {prizes.map((prize) => (
              <article
                key={prize.id}
                className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] p-3 shadow-2xl ${prize.glow} backdrop-blur-md transition-transform duration-300 hover:-translate-y-2`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${prize.accent}`}
                />
                <div className="flex items-center justify-center gap-2 py-4">
                  <Award className="h-7 w-7 text-amber-300" />
                  <h2
                    className={`bg-gradient-to-r ${prize.accent} bg-clip-text text-2xl font-black uppercase text-transparent lg:text-3xl`}
                  >
                    {prize.name}
                  </h2>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white p-4">
                  <Image
                    src={prize.image}
                    alt={`Phần thưởng ${prize.name}`}
                    width={640}
                    height={520}
                    className="h-full max-h-[48vh] w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
