"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const REEL_HEIGHT = 80; // px (h-20 = 80px)
const TOTAL_NUMBERS = 30; // reel dài
const SPIN_DURATION = 2000; // ms (animation time)
const STAGGER = 100; // ms between reels

function Reel({
  target,
  spinId,
  index,
}: {
  target: string;
  spinId: number;
  index: number;
}) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const isDigit = /^\d$/.test(target);
  const stopIndex = TOTAL_NUMBERS - 10 + (isDigit ? Number(target) : 0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !isDigit) return; // nếu là ?, bỏ qua luôn animation

    if (spinId === 0) {
      el.style.transition = "none";
      el.style.transform = `translateY(-${stopIndex * REEL_HEIGHT}px)`;
      return;
    }

    // Reset reel về đầu
    el.style.transition = "none";
    el.style.transform = `translateY(0px)`;
    void el.getBoundingClientRect();

    const delay = index * STAGGER;
    const finalTransform = `translateY(-${stopIndex * REEL_HEIGHT}px)`;

    const animation = el.animate(
      [{ transform: "translateY(0px)" }, { transform: finalTransform }],
      {
        duration: SPIN_DURATION,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        delay,
        fill: "forwards",
      }
    );

    animation.onfinish = () => {
      el.style.transform = finalTransform;
    };

    return () => {
      animation.cancel();
    };
  }, [spinId, stopIndex, index, isDigit]);

  return (
    <div className="relative overflow-hidden w-16 h-20 bg-white shadow-inner">
      {/* Nếu là '?' thì chỉ hiển thị nó thôi, không render số */}
      {!isDigit ? (
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-red-600">
          ?
        </div>
      ) : (
        <div ref={innerRef} style={{ willChange: "transform" }}>
          {Array.from({ length: TOTAL_NUMBERS }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 flex items-center justify-center text-4xl font-black text-red-600">
              {numbers[idx % 10]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SlotMachine() {
  const [spinId, setSpinId] = useState(0); // tăng mỗi khi click
  const [results, setResults] = useState<string[]>(["?", "?", "?", "?"]);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;

    // generate final numbers
    const final = Array.from({ length: results.length }, () =>
      String(Math.floor(Math.random() * 10))
    );
    setResults(final);

    // start spin
    setSpinning(true);
    setSpinId((s) => s + 1);

    // total timeout = duration + max stagger + small buffer
    const totalTime = SPIN_DURATION + STAGGER * (results.length - 1) + 200;
    setTimeout(() => {
      setSpinning(false);
      // note: we do NOT reset transform here — final position is left as-is
    }, totalTime);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className=" w-full bg-gradient-to-b from-red-500 to-red-700 rounded-xl shadow-lg border-4 border-red-300">
        <div className="flex gap-1 justify-center">
          {results.map((r, i) => (
            <Reel key={i} target={r} spinId={spinId} index={i} />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={spin}
          disabled={spinning}
          className={cn(
            "relative px-24 py-12 text-lg font-bold text-white rounded-lg",
            "bg-gradient-to-b from-red-400 to-red-600",
            "shadow-[0_4px_0_0_#b91c1c,0_6px_8px_rgba(0,0,0,0.3)]",
            "active:translate-y-1 active:shadow-[0_2px_0_0_#b91c1c,0_3px_4px_rgba(0,0,0,0.3)]",
            "transition-all duration-150 uppercase text-4xl"
          )}>
          {/* <Button
            onClick={spin}
            disabled={spinning}
            className="px-10 py-6 text-xl font-bold rounded-lg bg-yellow-400 text-red-700 shadow hover:bg-yellow-300"> */}
          Quay số
        </Button>
      </div>
    </div>
  );
}
