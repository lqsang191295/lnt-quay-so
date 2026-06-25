"use client";

import { act_UpdateUser } from "@/actions/act_user";
import { formatDateTime } from "@/lib/format";
import { IDataUser } from "@/lib/lottery-logic";
import { useUserDataStore } from "@/store/data-user";
import {
  Building2,
  CalendarDays,
  Gift,
  Maximize2,
  Search,
  Star,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { toast } from "sonner";

const PRIZE_ID = "v1";
const SPIN_TIME = 2400;
const DEFAULT_WHEEL_SIZE = 20;
const WHEEL_SIZE_OPTIONS = [10, 20, 50, 100, 200, 300];
const WHEEL_COLORS = [
  "#d9ff43",
  "#ff6b4a",
  "#7c6cff",
  "#27c7d8",
  "#f5c451",
  "#de5ba7",
  "#63d49b",
  "#5b8cff",
];

function ticketNumber(user: IDataUser | null) {
  if (!user) return "----";
  return String(user.SoPhieu ?? user.Stt).padStart(4, "0");
}

function winnerTime(user: IDataUser) {
  return user.NgayQuaySo?.split(" ")[1]?.slice(0, 8) || "--:--:--";
}

export default function LotteryV1Page() {
  const { DataThamGia, setDataThamGia } = useUserDataStore();
  const [displayUser, setDisplayUser] = useState<IDataUser | null>(null);
  const [latestWinner, setLatestWinner] = useState<IDataUser | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [wheelSize, setWheelSize] = useState(DEFAULT_WHEEL_SIZE);
  const [participantQuery, setParticipantQuery] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const wheelAnimationRef = useRef<Animation | null>(null);
  const wheelRotationRef = useRef(0);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const pointerAnimationRef = useRef<Animation | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const lastPointerSectorRef = useRef(-1);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      wheelAnimationRef.current?.cancel();
      pointerAnimationRef.current?.cancel();
      if (pointerFrameRef.current)
        cancelAnimationFrame(pointerFrameRef.current);
    },
    [],
  );

  const employees = useMemo(
    () =>
      DataThamGia.filter(
        (user) =>
          user.LoaiDS?.trim().toLocaleLowerCase() === "nv" &&
          user.TrangThai === 1,
      ),
    [DataThamGia],
  );

  const winners = useMemo(
    () =>
      DataThamGia.filter(
        (user) => user.GiaiTrung === PRIZE_ID && !user.HuyBo,
      ).reverse(),
    [DataThamGia],
  );

  const availableEmployees = useMemo(() => {
    const winnerIds = new Set(winners.map((user) => user.Stt));
    return employees.filter(
      (user) => !user.GiaiTrung && !user.HuyBo && !winnerIds.has(user.Stt),
    );
  }, [employees, winners]);

  const filteredWinners = winners;

  const filteredParticipants = useMemo(() => {
    const keyword = participantQuery.trim().toLocaleLowerCase("vi");
    if (!keyword) return employees;
    return employees.filter((user) =>
      [user.Hoten, user.NoiCongTac, ticketNumber(user)].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("vi")
          .includes(keyword),
      ),
    );
  }, [employees, participantQuery]);

  const wheelEntries = useMemo(() => {
    const pool = availableEmployees.length > 0 ? availableEmployees : employees;
    if (pool.length === 0) return [];
    return pool.slice(0, wheelSize);
  }, [availableEmployees, employees, wheelSize]);

  const wheelStyle = useMemo(() => {
    if (wheelEntries.length === 0) {
      return {
        background:
          "conic-gradient(from -22.5deg, #ef4444, #f59e0b, #16a34a, #0891b2, #2563eb, #7c3aed, #db2777, #ef4444)",
        "--segment-angle": "45deg",
        "--wheel-font-size": "10px",
      } as CSSProperties;
    }

    const count = Math.max(wheelEntries.length, 1);
    const step = 360 / count;
    const segments = wheelEntries.map(
      (_, index) =>
        `${WHEEL_COLORS[index % WHEEL_COLORS.length]} ${index * step}deg ${(index + 1) * step}deg`,
    );
    return {
      background: `conic-gradient(from -${step / 2}deg, ${segments.join(",")})`,
      "--segment-angle": `${step}deg`,
      "--wheel-font-size": `${wheelEntries.length > 200 ? 4 : wheelEntries.length > 100 ? 5 : wheelEntries.length > 50 ? 7 : 10}px`,
    } as CSSProperties;
  }, [wheelEntries]);

  const handleSpin = () => {
    if (isSpinning) return;

    if (wheelEntries.length === 0) {
      toast.info("Không còn nhân viên đủ điều kiện để quay.");
      return;
    }

    setIsSpinning(true);
    setLatestWinner(null);

    const wheel = wheelRef.current;
    if (wheel) {
      wheelAnimationRef.current?.cancel();
      pointerAnimationRef.current?.cancel();
      pointerAnimationRef.current = null;
      const startRotation = wheelRotationRef.current;
      const endRotation = startRotation + 5 * 360 + 180 + Math.random() * 360;
      const animation = wheel.animate(
        [
          { transform: `rotate(${startRotation}deg)` },
          { transform: `rotate(${endRotation}deg)` },
        ],
        {
          duration: SPIN_TIME,
          easing: "cubic-bezier(0.12, 0.72, 0.08, 1)",
          fill: "forwards",
        },
      );

      wheelAnimationRef.current = animation;
      wheelRotationRef.current = endRotation;
      const segmentAngle = 360 / Math.max(wheelEntries.length, 1);
      const initialAngle = ((startRotation % 360) + 360) % 360;
      lastPointerSectorRef.current = Math.floor(initialAngle / segmentAngle);

      const trackPointer = () => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(wheel).transform);
        const angle = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
        const normalizedAngle = (angle + 360) % 360;
        const sector = Math.floor(normalizedAngle / segmentAngle);

        if (sector !== lastPointerSectorRef.current) {
          lastPointerSectorRef.current = sector;
          const pointerIsReady =
            !pointerAnimationRef.current ||
            pointerAnimationRef.current.playState === "finished" ||
            pointerAnimationRef.current.playState === "idle";

          if (pointerIsReady) {
            const progress = Math.min(
              Number(animation.currentTime ?? 0) / SPIN_TIME,
              1,
            );
            const tickDuration = 45 + progress * 55;
            pointerAnimationRef.current =
              pointerRef.current?.animate(
                [
                  { transform: "rotate(0deg)" },
                  { transform: "rotate(-16deg) translateY(2px)" },
                  { transform: "rotate(0deg)" },
                ],
                {
                  duration: tickDuration,
                  easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
                },
              ) ?? null;
          }
        }

        if (animation.playState === "running") {
          pointerFrameRef.current = requestAnimationFrame(trackPointer);
        }
      };

      pointerFrameRef.current = requestAnimationFrame(trackPointer);
      animation.onfinish = () => {
        wheel.style.transform = `rotate(${endRotation}deg)`;
        if (pointerFrameRef.current)
          cancelAnimationFrame(pointerFrameRef.current);
      };
    }

    intervalRef.current = setInterval(() => {
      const preview =
        wheelEntries[Math.floor(Math.random() * wheelEntries.length)];
      setDisplayUser(preview);
    }, 75);

    window.setTimeout(async () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const selected =
        wheelEntries[Math.floor(Math.random() * wheelEntries.length)];
      const winner: IDataUser = {
        ...selected,
        GiaiTrung: PRIZE_ID,
        NgayQuaySo: formatDateTime(new Date()),
      };

      setDisplayUser(winner);
      setLatestWinner(winner);
      setShowWinnerModal(true);
      setDataThamGia(
        DataThamGia.map((user) => (user.Stt === winner.Stt ? winner : user)),
      );

      const result = await act_UpdateUser(winner);
      setIsSpinning(false);

      if (result === null) {
        setDataThamGia(DataThamGia);
        setLatestWinner(null);
        setShowWinnerModal(false);
        toast.error(
          "Không thể lưu kết quả. Vui lòng kiểm tra kết nối và quay lại.",
        );
        return;
      }

      toast.success(`Đã ghi nhận ${winner.Hoten} vào danh sách trúng thưởng`);
    }, SPIN_TIME);
  };

  return (
    <main className="relative h-screen overflow-hidden bg-[#d9efff] text-white selection:bg-[#7dd3fc] selection:text-[#06233d]">
      <Image
        className="absolute inset-0 h-full w-full object-cover opacity-100"
        src={"/bg-sn.jpg"}
        width={1920}
        height={1080}
        alt="Cup"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0c4a6e]/20" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0c4a6e]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0369a1]/45 to-transparent" />
        <div className="absolute -left-40 -top-56 h-[650px] w-[650px] rounded-full bg-[#bae6fd]/25 blur-[140px]" />
        <div className="absolute -bottom-64 right-[12%] h-[620px] w-[620px] rounded-full bg-[#38bdf8]/25 blur-[150px]" />
        <div className="absolute inset-0 opacity-[.075] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto flex h-screen max-w-[1600px] flex-col px-3 py-2.5 sm:px-5">
        {/* ── HEADER ── */}
        <header className="relative mb-2.5 flex h-[82px] shrink-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#7dd3fc]/40 bg-gradient-to-r from-[#0c4a6e]/80 via-[#075985]/70 to-[#0c4a6e]/80 px-4 shadow-[0_0_0_1px_rgba(125,211,252,.18),0_8px_40px_rgba(14,116,144,.45),0_0_80px_rgba(56,189,248,.15)] backdrop-blur-xl">
          {/* Shimmer top */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7dd3fc]/80 to-transparent" />
          {/* Shimmer bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/50 to-transparent" />
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[.05] to-transparent" />

          {/* Logo + tên bệnh viện */}
          <div className="flex items-center gap-3">
            <div className="relative flex bg-white h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-[#7dd3fc]/50 shadow-[0_0_16px_rgba(125,211,252,.25)]">
              <Image
                className="w-10 h-9 drop-shadow-[0_2px_6px_rgba(0,0,0,.3)]"
                src={"/logo.png"}
                width={48}
                height={40}
                alt="Logo"
              />
            </div>
            <div>
              <h1 className="text-[17px] font-black uppercase tracking-[.06em] drop-shadow-[0_1px_10px_rgba(125,211,252,.55)]">
                BV LÊ NGỌC TÙNG
              </h1>
              <p className="text-[8px] font-bold uppercase tracking-[.22em] text-[#7dd3fc]">
                Bệnh viện đa khoa Lê Ngọc Tùng
              </p>
            </div>
          </div>

          {/* Tiêu đề giữa */}
          <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-center lg:block">
            <div className="flex flex-row items-center">
              <Image
                className="w-8 h-8 mr-3 drop-shadow-[0_2px_8px_rgba(125,211,252,.4)]"
                src={"/la.png"}
                width={24}
                height={24}
                alt=""
              />
              <div>
                <h1 className="whitespace-nowrap text-[22px] font-black uppercase leading-none tracking-[.02em] drop-shadow-[0_2px_18px_rgba(125,211,252,.50)]">
                  Chương trình{" "}
                  <span className="bg-linear-to-r from-[#ffffff] via-[#7dd3fc] to-[#38bdf8] bg-clip-text text-transparent">
                    quay số may mắn
                  </span>
                </h1>
                <p className="mt-1.5 bg-linear-to-r from-[#e0f7ff] via-[#bae6fd] to-[#38bdf8] bg-clip-text text-[13px] font-semibold italic leading-none text-transparent">
                  Kết nối · Gắn kết · Vươn xa
                </p>
              </div>
              <Image
                className="w-8 h-8 ml-3 [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)] drop-shadow-[0_2px_8px_rgba(125,211,252,.4)]"
                src={"/la.png"}
                width={24}
                height={24}
                alt=""
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center overflow-hidden rounded-xl border border-sky-100/35 bg-[#0ea5e9]/25 shadow-[0_12px_34px_rgba(14,165,233,.22)] backdrop-blur-md">
            <label className="hidden items-center gap-2 border-r border-white/15 px-3 py-2 text-[10px] text-white/70 sm:flex">
              <CalendarDays className="h-4 w-4 text-[#bae6fd]" /> Số lát
              <select
                value={wheelSize}
                onChange={(event) => setWheelSize(Number(event.target.value))}
                disabled={isSpinning}
                className="bg-transparent font-bold text-[#e0f7ff] outline-none">
                {WHEEL_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} người
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="flex items-center gap-2 px-3 py-2 text-[10px] font-semibold text-white/90 transition hover:bg-white/10">
              <Maximize2 className="h-4 w-4" />
              Toàn màn hình
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[313px_minmax(560px,1fr)_382px]">
          <aside className="hidden min-h-0 flex-col gap-3 lg:flex">
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-sky-100/30 bg-[#075985]/[.42] p-4 shadow-[0_18px_44px_rgba(14,116,144,.20)] backdrop-blur-xl">
              <h2 className="mb-3 shrink-0 text-center text-[12px] font-black uppercase text-white/85">
                ({employees.length}) Danh sách quay số
              </h2>
              <label className="mb-2 flex shrink-0 items-center gap-2 rounded-lg border border-sky-100/30 bg-sky-50/[.10] px-3 py-2 text-sky-50/70 transition focus-within:border-[#7dd3fc]/80 focus-within:bg-sky-50/[.16]">
                <Search className="h-3.5 w-3.5" />
                <input
                  value={participantQuery}
                  onChange={(event) => setParticipantQuery(event.target.value)}
                  placeholder="Tìm kiếm nhân viên..."
                  className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/45"
                />
              </label>
              <div className="min-h-0 flex-1 divide-y divide-white/[.10] overflow-y-auto pr-1">
                {filteredParticipants.map((user, index) => (
                  <div key={user.Stt} className="flex items-center gap-2 py-2">
                    <span className="w-8 shrink-0 text-[10px] font-semibold text-[#bae6fd]">
                      {ticketNumber(user)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-white/90">
                        {user.Hoten}
                      </p>
                      <p className="truncate text-[9px] text-white/35">
                        {user.NoiCongTac || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <section className="relative flex min-h-0 flex-col items-center overflow-hidden rounded-2xl border border-sky-100/35 bg-[radial-gradient(circle_at_50%_22%,rgba(186,230,253,.34)_0%,rgba(14,116,144,.38)_45%,rgba(8,47,73,.62)_100%)] px-4 py-3 shadow-[0_24px_70px_rgba(14,116,144,.30)] backdrop-blur-sm">
            <Image
              className="absolute inset-0 h-full w-full object-cover opacity-28"
              src={"/bg-sn.jpg"}
              width={1920}
              height={1080}
              alt="Cup"
            />
            <div className="relative shrink-0 text-center">
              <h2 className="bg-linear-to-b from-[#fff8c2] via-[#ffd700] to-[#ffb800] bg-clip-text text-[20px] font-black uppercase leading-tight text-transparent drop-shadow-[0_2px_12px_rgba(255,215,0,.6)]">
                AI SẼ LÀ NGƯỜI MAY MẮN TIẾP THEO?
              </h2>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center p-0">
              <div className="relative h-[55vh] min-h-[360px] max-h-[540px] w-[55vh] min-w-[360px] max-w-[540px] shrink-0 rounded-full bg-gradient-to-br from-[#e0f7ff] via-[#7dd3fc] to-[#0284c7] p-[7px] shadow-[0_0_0_3px_rgba(224,247,255,.25),0_22px_55px_rgba(14,116,144,.32),0_0_70px_rgba(56,189,248,.25)]">
                <div className="pointer-events-none absolute left-1/2 top-[-30px] z-30 -translate-x-1/2">
                  <div
                    ref={pointerRef}
                    className="h-0 w-0 origin-top border-l-[15px] border-r-[15px] border-t-[38px] border-l-transparent border-r-transparent border-t-[#7dd3fc]"
                  />
                  <div className="absolute left-1/2 top-[-5px] h-7 w-7 -translate-x-1/2 rounded-full border-4 border-[#0c4a6e] bg-[#7dd3fc]" />
                </div>
                <div
                  ref={wheelRef}
                  className="lottery-wheel relative h-full w-full overflow-hidden rounded-full border-[2px] border-white/60"
                  style={wheelStyle}>
                  {wheelEntries.map((user, index) => {
                    const angle =
                      index * (360 / wheelEntries.length) +
                      180 / wheelEntries.length -
                      90;
                    return (
                      <div
                        key={`${user.Stt}-${index}`}
                        className="wheel-label"
                        title={user.Hoten}
                        style={
                          { "--wheel-angle": `${angle}deg` } as CSSProperties
                        }>
                        <span>{user.Hoten}</span>
                      </div>
                    );
                  })}
                </div>
                {Array.from({ length: 16 }).map((_, index) => (
                  <span
                    key={index}
                    className="wheel-bulb absolute left-1/2 top-1/2 z-20 h-2 w-2 rounded-full bg-white/80"
                    style={
                      { "--bulb-angle": `${index * 22.5}deg` } as CSSProperties
                    }
                  />
                ))}
                <button
                  type="button"
                  onClick={handleSpin}
                  disabled={isSpinning || availableEmployees.length === 0}
                  className="absolute left-1/2 top-1/2 z-30 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[6px] border-[#075985] bg-[#7dd3fc] text-[#06233d] shadow-[0_10px_28px_rgba(14,116,144,.42),0_0_32px_rgba(125,211,252,.28)] transition hover:scale-105 disabled:cursor-not-allowed sm:h-24 sm:w-24">
                  <Gift
                    className={`mb-1 h-5 w-5 ${isSpinning ? "animate-bounce" : ""}`}
                  />
                  <span className="text-sm font-black uppercase tracking-[.08em]">
                    {isSpinning ? "Đang quay" : "Quay ngay"}
                  </span>
                </button>
              </div>
            </div>

            <div
              className={`relative mt-3 mb-1 flex w-full max-w-xl shrink-0 items-center gap-3 rounded-2xl border px-4 py-2.5 backdrop-blur-md ${latestWinner ? "border-[#7dd3fc]/80 bg-gradient-to-r from-[#0e7490]/[.72] to-[#075985]/70 shadow-[0_0_30px_rgba(125,211,252,.22)]" : "border-sky-100/30 bg-[#075985]/35 shadow-[0_12px_38px_rgba(14,116,144,.20)]"}`}>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${latestWinner ? "border-[#7dd3fc] bg-[#7dd3fc]/15 text-[#bae6fd]" : "border-sky-100/30 bg-sky-50/[.08] text-sky-50/65"}`}>
                <UserRound className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[9px] font-black uppercase tracking-[.2em] ${latestWinner ? "text-[#bae6fd]" : "text-sky-50/45"}`}>
                  {latestWinner
                    ? "Chúc mừng người trúng thưởng"
                    : isSpinning
                      ? "Đang lựa chọn người may mắn"
                      : "Sẵn sàng quay số"}
                </p>
                <h3 className="truncate text-lg font-black text-yellow-300 drop-shadow-[0_2px_12px_rgba(255,215,0,.6)]">
                  {displayUser?.Hoten || "Chưa có kết quả"}
                </h3>
                <p className="truncate text-xs text-white">
                  <Building2 className="mr-1 inline h-3.5 w-3.5" />
                  {displayUser?.NoiCongTac || "Nhấn Quay ngay để bắt đầu"}
                </p>
              </div>
              <span className="text-sm font-black text-[#bae6fd]">
                {ticketNumber(displayUser)}
              </span>
            </div>
          </section>

          <aside className="relative min-h-0 overflow-hidden rounded-2xl border border-sky-100/30 bg-[#075985]/[.42] shadow-[0_18px_44px_rgba(14,116,144,.20)] backdrop-blur-xl">
            <div className="relative flex h-full min-h-0 flex-col p-4">
              <div className="mb-3 flex items-center justify-between border-b border-white/[.08] pb-3">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[.32em] text-[#bae6fd]">
                    Kết quả chương trình
                  </p>
                  <h2 className="text-[16px] font-black uppercase text-yellow-300">
                    {`Người trúng giải (${winners.length})`}
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[.06] text-white/60">
                  <Trophy className="h-5 w-5 text-[#7dd3fc]" />
                </div>
              </div>

              {filteredWinners.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-sky-200/28 bg-sky-200/[.08] shadow-[0_0_40px_rgba(125,211,252,.16)]">
                    <Trophy className="h-10 w-10 text-sky-200/60" />
                  </div>
                  <p className="font-bold text-white/70">
                    Bảng vàng đang chờ chủ nhân
                  </p>
                  <p className="mt-2 max-w-56 text-sm text-sky-50/60">
                    Kết quả sẽ tỏa sáng tại đây sau mỗi lượt quay
                  </p>
                </div>
              ) : (
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {filteredWinners.map((user, index) => {
                    return (
                      <article
                        key={user.Stt}
                        className="flex min-h-[66px] items-center gap-2 rounded-xl border border-sky-100/25 bg-sky-50/[.09] pl-2 pr-1 py-1 backdrop-blur-md transition hover:border-[#7dd3fc]/55 hover:bg-sky-50/[.14]">
                        <div className="flex flex-col justify-center items-center gap-1">
                          <RankBadge rank={index + 1} featured={index < 3} />
                          <span className="w-8 shrink-0 text-[10px] font-bold text-[#bae6fd]">
                            {ticketNumber(user)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[18px] font-bold text-yellow-300">
                            {user.Hoten}
                          </h3>
                          <p className="mt-0.5 truncate text-[9px] text-white">
                            {user.NoiCongTac || "Chưa cập nhật đơn vị"}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowLeaderboardModal(true)}
                disabled={winners.length === 0}
                className="mt-3 flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-sky-100/30 bg-sky-50/[.09] text-[11px] font-bold text-sky-50 backdrop-blur-md transition hover:border-[#7dd3fc]/60 hover:bg-sky-50/[.16] hover:text-[#bae6fd] disabled:cursor-not-allowed disabled:opacity-40">
                Xem tất cả <span aria-hidden="true">›</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ── LEADERBOARD MODAL ── */}
      {showLeaderboardModal && (
        <div
          className="fixed inset-0 z-40 flex bg-[#0c4a6e]/70 p-2 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Toàn bộ danh sách trúng thưởng">
          <div className="relative mx-auto flex h-full w-full max-w-[1500px] min-h-0 flex-col overflow-hidden rounded-2xl border border-sky-100/30 bg-[#075985]/[.82] shadow-[0_30px_120px_rgba(14,116,144,.42)] backdrop-blur-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/12 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#7dd3fc]/55 bg-[#7dd3fc]/15 text-[#bae6fd]">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase">
                    Danh sách trúng thưởng
                  </h2>
                  <p className="text-[10px] text-white/40">
                    Tổng cộng {winners.length} người
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLeaderboardModal(false)}
                aria-label="Đóng danh sách"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-100/25 text-sky-50/70 transition hover:border-[#7dd3fc]/60 hover:text-[#bae6fd]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mx-5 mt-4 hidden shrink-0 grid-cols-[70px_100px_minmax(180px,1fr)_minmax(180px,1fr)_130px] gap-4 border-b border-white/12 px-4 pb-3 text-[9px] font-black uppercase tracking-[.16em] text-white/45 sm:grid sm:px-5">
              <span>Hạng</span>
              <span>Mã số</span>
              <span>Họ và tên</span>
              <span>Đơn vị</span>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:px-5 sm:pb-5">
              {winners.map((user, index) => (
                <article
                  key={user.Stt}
                  className="grid items-center gap-2 rounded-xl border border-sky-100/25 bg-sky-50/[.09] px-4 py-3 backdrop-blur-md transition hover:border-[#7dd3fc]/55 hover:bg-sky-50/[.14] sm:grid-cols-[70px_100px_minmax(180px,1fr)_minmax(180px,1fr)_130px] sm:gap-4 sm:px-5">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={index + 1} featured={index < 3} />
                    <span className="text-[9px] text-white/30 sm:hidden">
                      Hạng {index + 1}
                    </span>
                  </div>
                  <span className="text-[18px] font-bold text-[#bae6fd]">
                    {ticketNumber(user)}
                  </span>
                  <h3 className="truncate text-[26px] font-bold text-yellow-300 drop-shadow-[0_2px_12px_rgba(255,215,0,.6)] sm:text-[18px]">
                    {user.Hoten}
                  </h3>
                  <p className="truncate text-[18px] text-white/45">
                    {user.NoiCongTac || "Chưa cập nhật đơn vị"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WINNER MODAL ── */}
      {showWinnerModal && latestWinner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c4a6e]/[.80] p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Người trúng thưởng">
          <button
            type="button"
            aria-label="Đóng popup"
            className="absolute inset-0 cursor-default"
            onClick={() => !isSpinning && setShowWinnerModal(false)}
          />

          {/* Confetti dots */}
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="pointer-events-none absolute animate-bounce rounded-full"
              style={{
                left: `${5 + ((i * 37) % 90)}%`,
                top: `${5 + ((i * 53) % 85)}%`,
                width: `${4 + (i % 4) * 3}px`,
                height: `${4 + (i % 4) * 3}px`,
                backgroundColor: [
                  "#7dd3fc",
                  "#f5c451",
                  "#de5ba7",
                  "#63d49b",
                  "#ff6b4a",
                ][i % 5],
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${0.8 + (i % 3) * 0.4}s`,
                opacity: 0.75,
              }}
            />
          ))}

          <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border-2 border-[#7dd3fc]/60 bg-[#075985]/[.94] px-6 py-8 text-center shadow-[0_0_0_5px_rgba(125,211,252,.10),0_30px_100px_rgba(14,116,144,.65)] backdrop-blur-xl sm:px-10">
            {/* Shimmer top */}
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#7dd3fc]/90 to-transparent" />
            {/* Shimmer bottom */}
            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/50 to-transparent" />
            {/* Glow blobs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-fuchsia-400/15 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#f5c451]/10 blur-3xl" />

            {/* Stars */}
            {Array.from({ length: 10 }).map((_, i) => (
              <Star
                key={i}
                className="absolute h-3 w-3 fill-sky-200 text-cyan-100 animate-pulse"
                style={{
                  left: `${8 + ((i * 31) % 86)}%`,
                  top: `${7 + ((i * 47) % 78)}%`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}

            <div className="relative">
              {/* Trophy */}
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#f5c451]/70 bg-gradient-to-br from-[#f5c451]/25 to-[#7dd3fc]/15 shadow-[0_0_0_8px_rgba(245,196,81,.10),0_0_55px_rgba(245,196,81,.30)]">
                <Trophy className="h-12 w-12 text-[#f5c451] drop-shadow-[0_2px_12px_rgba(245,196,81,.6)]" />
              </div>

              {/* Badge */}
              <div className="mx-auto mb-4 w-fit rounded-full border border-[#7dd3fc]/50 bg-[#7dd3fc]/15 px-6 py-1.5">
                <p className="text-[11px] font-black uppercase tracking-[.4em] text-[#7dd3fc]">
                  🎉 Chúc mừng
                </p>
              </div>

              <h2 className="text-2xl font-black uppercase text-white drop-shadow-[0_2px_12px_rgba(125,211,252,.35)] sm:text-3xl">
                Người trúng thưởng
              </h2>

              {/* Số phiếu — nổi bật nhất */}
              <div className="mx-auto my-5 w-fit rounded-2xl border-2 border-[#f5c451]/80 bg-gradient-to-br from-[#f5c451]/20 to-[#fbbf24]/10 px-10 py-4 shadow-[0_0_0_4px_rgba(245,196,81,.08),0_0_36px_rgba(245,196,81,.35),inset_0_1px_0_rgba(255,255,255,.12)]">
                <p className="mb-1 text-[9px] font-black uppercase tracking-[.35em] text-[#f5c451]/75">
                  Số phiếu may mắn
                </p>
                <p className="text-5xl font-black tracking-[.22em] text-[#f5c451] drop-shadow-[0_2px_20px_rgba(245,196,81,.55)] sm:text-6xl">
                  {ticketNumber(latestWinner)}
                </p>
              </div>

              {/* Tên — nổi bật thứ hai */}
              <h3 className="text-3xl font-black text-yellow-300 drop-shadow-[0_2px_12px_rgba(255,215,0,.6)] sm:text-4xl">
                {latestWinner.Hoten}
              </h3>

              {/* Đơn vị */}
              <p className="mx-auto mt-3 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[.06] px-4 py-2.5 text-sm text-white/55">
                <Building2 className="h-4 w-4 shrink-0 text-[#7dd3fc]" />
                {latestWinner.NoiCongTac || "Chưa cập nhật đơn vị"}
              </p>

              <button
                type="button"
                onClick={() => setShowWinnerModal(false)}
                disabled={isSpinning}
                className="mt-7 rounded-full border-2 border-[#7dd3fc]/60 bg-[#7dd3fc] px-12 py-3.5 text-[15px] font-black uppercase tracking-[.12em] text-[#06233d] shadow-[0_0_30px_rgba(125,211,252,.45)] transition hover:scale-105 hover:shadow-[0_0_45px_rgba(125,211,252,.60)] disabled:opacity-60">
                {isSpinning ? "Đang lưu kết quả..." : "✓ Tiếp tục"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .lottery-wheel {
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.28);
        }
        .lottery-wheel::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: repeating-conic-gradient(
            transparent 0deg calc(var(--segment-angle) - 0.15deg),
            rgba(255, 255, 255, 0.62) calc(var(--segment-angle) - 0.15deg)
              var(--segment-angle)
          );
        }
        .wheel-label {
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 50%;
          display: flex;
          height: max(var(--wheel-font-size), 3px);
          width: 45%;
          transform: translateY(-50%) rotate(var(--wheel-angle));
          transform-origin: 0 50%;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          pointer-events: none;
        }
        .wheel-label span {
          display: block;
          width: 76%;
          overflow: hidden;
          white-space: nowrap;
          text-align: right;
          font-size: var(--wheel-font-size);
          line-height: 1;
          font-weight: 800;
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95);
        }
        .wheel-bulb {
          transform: translate(-50%, -50%) rotate(var(--bulb-angle))
            translateY(calc(-1 * clamp(172px, 26vh, 259px)));
        }
      `}</style>
    </main>
  );
}

function RankBadge({ rank, featured }: { rank: number; featured: boolean }) {
  return (
    <div
      className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${featured ? "bg-slate-200 text-slate-800" : "bg-slate-300/90 text-slate-800"}`}>
      {rank}
    </div>
  );
}

function DashboardStat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  color: "violet" | "green" | "gold";
}) {
  const tones = {
    violet: "border-sky-200/40 bg-sky-200/15 text-sky-100",
    green: "border-cyan-200/40 bg-cyan-200/15 text-cyan-100",
    gold: "border-blue-200/40 bg-blue-200/15 text-blue-100",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[.075] p-2.5 backdrop-blur-md">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${tones[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p
          className={`text-xl font-black ${color === "green" ? "text-cyan-100" : color === "gold" ? "text-blue-100" : "text-sky-100"}`}>
          {value}
        </p>
        <p className="text-[10px] text-white/60">{label}</p>
      </div>
    </div>
  );
}
