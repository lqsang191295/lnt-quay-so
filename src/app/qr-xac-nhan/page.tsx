import Image from "next/image";

export default function AttendanceConfirmationQrPage() {
  return (
<main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-3 md:p-5">
  <section className="flex h-full max-h-full w-full max-w-3xl min-h-0 flex-col items-center rounded-3xl border border-white/15 bg-white/10 px-4 py-4 text-center shadow-2xl backdrop-blur-sm md:px-8 md:py-5">

    <h1 className="shrink-0 text-3xl font-black uppercase tracking-wide leading-[1.3] text-white md:text-5xl">
      Quét mã QR
      <br />
      để quay số may mắn
    </h1>

    <p className="mt-2 shrink-0 text-sm text-blue-100 md:text-lg">
      Vui lòng dùng camera điện thoại để quét mã
    </p>

    <div className="mt-4 flex min-h-0 w-full flex-1 items-center justify-center">
      <div className="flex h-full max-w-full items-center justify-center rounded-3xl bg-white p-3 shadow-[0_0_60px_rgba(255,255,255,0.2)] md:p-4">
        <Image
          src="/qr/qr-xac-nhan-tham-gia.jpg"
          alt="Mã QR xác nhận tham gia"
          width={710}
          height={710}
          priority
          className="h-full w-auto max-w-full object-contain"
        />
      </div>
    </div>

  </section>
</main>
  );
}
