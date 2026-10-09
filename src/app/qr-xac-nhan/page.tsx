import Image from "next/image";

export default function AttendanceConfirmationQrPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <section className="flex w-full max-w-3xl flex-col items-center rounded-3xl border border-white/15 bg-white/10 px-6 py-8 text-center shadow-2xl backdrop-blur-sm md:px-12 md:py-10">
        <h1 className="text-3xl font-black uppercase tracking-wide text-white md:text-5xl">
          Quét mã QR để xác nhận tham gia
        </h1>
        <p className="mt-3 text-base text-blue-100 md:text-xl">
          Vui lòng dùng camera điện thoại để quét mã và xác nhận tham dự
        </p>

        <div className="mt-8 rounded-3xl bg-white p-4 shadow-[0_0_60px_rgba(255,255,255,0.2)] md:p-6">
          <Image
            src="/qr/qr-xac-nhan-tham-gia.jpg"
            alt="Mã QR xác nhận tham gia"
            width={720}
            height={720}
            priority
            className="h-auto max-h-[65vh] w-auto max-w-full object-contain"
          />
        </div>
      </section>
    </main>
  );
}
