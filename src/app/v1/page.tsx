"use client";

import { act_UpdateUser } from "@/actions/act_user";
import { formatDateTime } from "@/lib/format";
import { IDataUser } from "@/lib/lottery-logic";
import { useUserDataStore } from "@/store/data-user";
import {
  Boxes,
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
const DEFAULT_WHEEL_SIZE = 100;
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
    <main className="relative h-screen overflow-hidden bg-[#02050b] font-[Arial,sans-serif] text-white selection:bg-[#f6bf48] selection:text-black">
      <Image
        className="w-full h-full absolute inset-0 object-cover opacity-30"
        src={"/bg-luxury.png"}
        width={1920}
        height={1080}
        alt="Cup"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-56 h-[650px] w-[650px] rounded-full bg-[#f6bf48]/[.05] blur-[140px]" />
        <div className="absolute -bottom-64 right-[12%] h-[620px] w-[620px] rounded-full bg-[#7c6cff]/[.08] blur-[150px]" />
        <div className="absolute inset-0 opacity-[.035] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto flex h-screen max-w-[1600px] flex-col px-3 py-2.5 sm:px-5">
        <header className="relative mb-2.5 flex h-[78px] shrink-0 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-[#f6bf48]/50 bg-[#f6bf48]/10 text-[#f6bf48]">
              <Boxes className="h-7 w-7" strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#f6bf48]">
                Together we grow
              </p>
              <h1 className="font-['Arial_Narrow',Arial,sans-serif] text-lg font-black uppercase tracking-[.04em]">
                Company
              </h1>
            </div>
          </div>
          <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-center lg:block">
            <div className="flex flex-row">
              <Image
                className="w-8 h-8 mr-3"
                src={"/la.png"}
                width={24}
                height={24}
                alt="Cup"
              />
              <h1 className="whitespace-nowrap font-['Arial_Narrow',Arial,sans-serif] text-[21px] font-black uppercase leading-none tracking-[.02em]">
                Chương trình{" "}
                <span className="bg-linear-to-r from-[#ffe08a] via-[#f6bf48] to-[#c98912] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  quay số may mắn
                </span>
              </h1>
              <Image
                className="w-8 h-8 ml-3 [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)]"
                src={"/la.png"}
                width={24}
                height={24}
                alt="Cup"
              />
            </div>
            <p className="mt-1 font-serif text-[16px] italic leading-none bg-linear-to-r from-[#ffe08a] via-[#f6bf48] to-[#c98912] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
              Kết nối · Gắn kết · Vươn xa
            </p>
          </div>
          <div className="flex items-center overflow-hidden rounded-xl border border-[#263149] bg-[#08101d]">
            <label className="hidden items-center gap-2 border-r border-[#263149] px-3 py-2 text-[10px] text-white/45 sm:flex">
              <CalendarDays className="h-4 w-4 text-white/70" /> Số lát
              <select
                value={wheelSize}
                onChange={(event) => setWheelSize(Number(event.target.value))}
                disabled={isSpinning}
                className="bg-transparent font-bold text-[#f6bf48] outline-none">
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
              className="flex items-center gap-2 px-3 py-2 text-[10px] font-semibold text-white/80 hover:bg-white/5">
              <Maximize2 className="h-4 w-4" />
              Toàn màn hình
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[313px_minmax(560px,1fr)_332px]">
          <aside className="hidden min-h-0 flex-col gap-3 lg:flex">
            <section className="shrink-0 rounded-2xl border border-[#25304a] bg-[#070d18]/95 p-4">
              <h2 className="mb-3 text-center font-['Arial_Narrow',Arial,sans-serif] text-[12px] font-black uppercase text-white/85">
                Thống kê chương trình
              </h2>
              <div className="grid gap-2">
                <DashboardStat
                  icon={Users}
                  value={employees.length}
                  label="Tổng nhân viên"
                  color="violet"
                />
                <DashboardStat
                  icon={Gift}
                  value={winners.length}
                  label="Đã trúng thưởng"
                  color="green"
                />
              </div>
            </section>
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#25304a] bg-[#070d18]/95 p-4">
              <h2 className="mb-3 shrink-0 text-center font-['Arial_Narrow',Arial,sans-serif] text-[12px] font-black uppercase text-white/85">
                Danh sách người tham gia
              </h2>
              <label className="mb-2 flex shrink-0 items-center gap-2 rounded-lg border border-[#2b3650] bg-black/20 px-3 py-2 text-white/35 focus-within:border-[#f6bf48]/60">
                <Search className="h-3.5 w-3.5" />
                <input
                  value={participantQuery}
                  onChange={(event) => setParticipantQuery(event.target.value)}
                  placeholder="Tìm kiếm nhân viên..."
                  className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"
                />
              </label>
              <div className="min-h-0 flex-1 divide-y divide-white/[.06] overflow-y-auto pr-1">
                {filteredParticipants.map((user, index) => (
                  <div key={user.Stt} className="flex items-center gap-2 py-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#7367f0] text-[9px] font-black">
                      {index + 1}
                    </span>
                    <span className="w-12 shrink-0 font-mono text-[10px] text-[#62d8ff]">
                      {ticketNumber(user)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-white/90">
                        {user.Hoten}
                      </p>
                      <p className="truncate text-[9px] text-white/35">
                        {user.NoiCongTac || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 shrink-0 text-[9px] text-white/30">
                Hiển thị {filteredParticipants.length} / {employees.length} nhân
                viên
              </p>
            </section>
          </aside>

          <section className="relative flex min-h-0 flex-col items-center overflow-hidden rounded-2xl border border-[#27254b] bg-[radial-gradient(circle_at_50%_18%,#25145d_0%,#0b0922_44%,#070b16_100%)] px-4 py-3 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
            <Image
              className="w-full h-full absolute inset-0 object-cover opacity-50"
              src={"/bg-luxury.png"}
              width={1920}
              height={1080}
              alt="Cup"
            />
            <div className="relative shrink-0 text-center">
              <h2 className="bg-linear-to-b from-[#fff7d6] to-[#e6a628] bg-clip-text font-['Arial_Narrow',Arial,sans-serif] text-[20px] font-black uppercase leading-tight text-transparent">
                AI SẼ LÀ NGƯỜI MAY MẮN TIẾP THEO?
              </h2>
            </div>

            <div className="relative flex min-h-0 flex-1 items-end justify-center pb-1 pt-5">
              <div className="relative h-[42vh] min-h-[300px] max-h-[420px] w-[42vh] min-w-[300px] max-w-[420px] shrink-0 rounded-full bg-gradient-to-br from-[#ffe28b] via-[#f6bf48] to-[#9a5a08] p-[7px] shadow-[0_0_0_3px_rgba(246,191,72,.12),0_20px_50px_rgba(0,0,0,.5)]">
                <div className="pointer-events-none absolute left-1/2 top-[-30px] z-30 -translate-x-1/2">
                  <div
                    ref={pointerRef}
                    className="h-0 w-0 origin-top border-l-[15px] border-r-[15px] border-t-[38px] border-l-transparent border-r-transparent border-t-[#f6bf48]"
                  />
                  <div className="absolute left-1/2 top-[-5px] h-7 w-7 -translate-x-1/2 rounded-full border-4 border-[#090a0a] bg-[#f6bf48]" />
                </div>
                <div
                  ref={wheelRef}
                  className="lottery-wheel relative h-full w-full overflow-hidden rounded-full border-[2px] border-white/30"
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
                  className="absolute left-1/2 top-1/2 z-30 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[6px] border-[#3c4646] bg-[#f6bf48] text-[#351f00] shadow-[0_10px_28px_rgba(0,0,0,.45)] transition hover:scale-105 disabled:cursor-not-allowed sm:h-24 sm:w-24">
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
              className={`relative mt-3 mb-1 flex w-full max-w-xl shrink-0 items-center gap-3 rounded-2xl border px-4 py-2.5 ${latestWinner ? "border-[#f6bf48]/70 bg-gradient-to-r from-[#21150d] to-[#17111f] shadow-[0_0_28px_rgba(246,191,72,.16)]" : "border-white/10 bg-black/25"}`}>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${latestWinner ? "border-[#f6bf48] bg-[#f6bf48]/10 text-[#f6bf48]" : "border-white/15 text-white/25"}`}>
                <UserRound className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[9px] font-black uppercase tracking-[.2em] ${latestWinner ? "text-[#f6bf48]" : "text-white/30"}`}>
                  {latestWinner
                    ? "Chúc mừng người trúng thưởng"
                    : isSpinning
                      ? "Đang lựa chọn người may mắn"
                      : "Sẵn sàng quay số"}
                </p>
                <h3 className="truncate font-['Arial_Narrow',Arial,sans-serif] text-lg font-black text-white">
                  {displayUser?.Hoten || "Chưa có kết quả"}
                </h3>
                <p className="truncate text-xs text-white/40">
                  <Building2 className="mr-1 inline h-3.5 w-3.5" />
                  {displayUser?.NoiCongTac || "Nhấn Quay ngay để bắt đầu"}
                </p>
              </div>
              <span className="font-mono text-sm font-black text-[#f6bf48]">
                {ticketNumber(displayUser)}
              </span>
            </div>
          </section>

          <aside className="relative min-h-0 overflow-hidden rounded-2xl border border-[#25304a] bg-[#070d18]/95 shadow-[0_30px_80px_rgba(0,0,0,.3)]">
            <div className="relative flex h-full min-h-0 flex-col p-4">
              <div className="mb-3 flex items-center justify-between border-b border-white/[.08] pb-3">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[.32em] text-[#f6bf48]">
                    Kết quả chương trình
                  </p>
                  <h2 className="font-['Arial_Narrow',Arial,sans-serif] text-[16px] font-black uppercase">
                    Người chiến thắng
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40">
                  <Trophy className="h-5 w-5 text-[#f6bf48]" />
                </div>
              </div>

              {filteredWinners.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/5 shadow-[0_0_40px_rgba(34,211,238,.12)]">
                    <Trophy className="h-10 w-10 text-cyan-300/40" />
                  </div>
                  <p className="font-bold text-white/70">
                    Bảng vàng đang chờ chủ nhân
                  </p>
                  <p className="mt-2 max-w-56 text-sm text-cyan-100/35">
                    Kết quả sẽ tỏa sáng tại đây sau mỗi lượt quay
                  </p>
                </div>
              ) : (
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {filteredWinners.map((user, index) => {
                    return (
                      <article
                        key={user.Stt}
                        className="flex min-h-[66px] items-center gap-2 rounded-xl border border-[#202a3d] bg-[#101725]/85 px-3 py-2.5 transition hover:border-[#f6bf48]/30">
                        <RankBadge rank={index + 1} featured={index < 3} />
                        <span className="w-12 shrink-0 font-mono text-[10px] font-bold text-[#f6bf48]">
                          {ticketNumber(user)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[12px] font-bold text-white/95">
                            {user.Hoten}
                          </h3>
                          <p className="mt-0.5 truncate text-[9px] text-white/40">
                            {user.NoiCongTac || "Chưa cập nhật đơn vị"}
                          </p>
                        </div>
                        <time className="shrink-0 text-[9px] text-white/45">
                          {winnerTime(user)}
                        </time>
                      </article>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowLeaderboardModal(true)}
                disabled={winners.length === 0}
                className="mt-3 flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#2a354d] bg-[#0b1220] text-[11px] font-bold text-white/80 transition hover:border-[#f6bf48]/50 hover:text-[#f6bf48] disabled:cursor-not-allowed disabled:opacity-40">
                Xem tất cả <span aria-hidden="true">›</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {showLeaderboardModal && (
        <div
          className="fixed inset-0 z-40 flex bg-[#02050b]/95 p-2 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Toàn bộ danh sách trúng thưởng">
          <div className="relative mx-auto flex h-full w-full max-w-[1500px] min-h-0 flex-col overflow-hidden rounded-2xl border border-[#33405c] bg-[#070d18] shadow-[0_30px_120px_rgba(0,0,0,.8)]">
            <div className="flex shrink-0 items-center justify-between border-b border-[#263149] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#f6bf48]/40 bg-[#f6bf48]/10 text-[#f6bf48]">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-['Arial_Narrow',Arial,sans-serif] text-xl font-black uppercase ">
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-[#f6bf48]/50 hover:text-[#f6bf48]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mx-5 mt-4 hidden shrink-0 grid-cols-[70px_100px_minmax(180px,1fr)_minmax(180px,1fr)_130px] gap-4 border-b border-[#263149] px-4 pb-3 text-[9px] font-black uppercase tracking-[.16em] text-white/35 sm:grid sm:px-5">
              <span>Hạng</span>
              <span>Mã số</span>
              <span>Họ và tên</span>
              <span>Đơn vị</span>
              <span className="text-right">Thời gian</span>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:px-5 sm:pb-5">
              {winners.map((user, index) => (
                <article
                  key={user.Stt}
                  className="grid items-center gap-2 rounded-xl border border-[#202a3d] bg-[#101725]/85 px-4 py-3 transition hover:border-[#f6bf48]/35 sm:grid-cols-[70px_100px_minmax(180px,1fr)_minmax(180px,1fr)_130px] sm:gap-4 sm:px-5">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={index + 1} featured={index < 3} />
                    <span className="text-[9px] text-white/30 sm:hidden">
                      Hạng {index + 1}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#f6bf48]">
                    {ticketNumber(user)}
                  </span>
                  <h3 className="truncate text-[13px] font-bold text-white/95">
                    {user.Hoten}
                  </h3>
                  <p className="truncate text-[11px] text-white/45">
                    {user.NoiCongTac || "Chưa cập nhật đơn vị"}
                  </p>
                  <time className="text-[10px] text-white/45 sm:text-right">
                    {winnerTime(user)}
                  </time>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {showWinnerModal && latestWinner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Người trúng thưởng">
          <button
            type="button"
            aria-label="Đóng popup"
            className="absolute inset-0 cursor-default"
            onClick={() => !isSpinning && setShowWinnerModal(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#121414] px-6 py-8 text-center shadow-[0_30px_100px_rgba(0,0,0,.7)] sm:px-10">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-12 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
            {Array.from({ length: 12 }).map((_, index) => (
              <Star
                key={index}
                className="absolute h-3 w-3 fill-amber-300 text-amber-200 animate-pulse"
                style={{
                  left: `${8 + ((index * 31) % 86)}%`,
                  top: `${7 + ((index * 47) % 78)}%`,
                  animationDelay: `${index * 0.12}s`,
                }}
              />
            ))}
            <div className="relative">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f6bf48] shadow-[0_0_45px_rgba(246,191,72,.2)]">
                <Trophy className="h-9 w-9 text-black" />
              </div>
              <p className="text-xs font-black uppercase tracking-[.35em] text-[#f6bf48]">
                Chúc mừng
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">
                Người trúng thưởng
              </h2>
              <div className="mx-auto my-5 w-fit rounded-full border border-white/10 bg-white/[.04] px-7 py-3 font-mono text-4xl font-black tracking-[.2em] text-white">
                {ticketNumber(latestWinner)}
              </div>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {latestWinner.Hoten}
              </h3>
              <p className="mt-2 flex items-center justify-center gap-2 text-white/40">
                <Building2 className="h-4 w-4" />
                {latestWinner.NoiCongTac || "Chưa cập nhật đơn vị"}
              </p>
              <button
                type="button"
                onClick={() => setShowWinnerModal(false)}
                disabled={isSpinning}
                className="mt-7 rounded-full bg-[#f6bf48] px-10 py-3 font-black uppercase tracking-[.12em] text-black transition hover:scale-105 disabled:opacity-60">
                {isSpinning ? "Đang lưu kết quả..." : "Tiếp tục"}
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
            translateY(calc(-1 * clamp(143px, 19.5vh, 199px)));
        }
      `}</style>
    </main>
  );
}

function RankBadge({ rank, featured }: { rank: number; featured: boolean }) {
  return (
    <div
      className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-black ${featured ? "bg-slate-200 text-slate-800" : "bg-slate-300/90 text-slate-800"}`}>
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
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    gold: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#26314a] bg-[#111827]/80 p-2.5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${tones[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p
          className={`text-xl font-black ${color === "green" ? "text-emerald-400" : color === "gold" ? "text-amber-400" : "text-violet-400"}`}>
          {value}
        </p>
        <p className="text-[10px] text-white/45">{label}</p>
      </div>
    </div>
  );
}
