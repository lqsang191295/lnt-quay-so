"use client";

import { act_XacNhanThamGia } from "@/actions/act_user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";

interface ConfirmationResult {
  Success?: number;
  Message?: string;
  Stt?: number | string;
  stt?: number | string;
  STT?: number | string;
  SoThuTu?: number | string;
  soThuTu?: number | string;
}

export default function ConfirmAttendancePage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [attendeeNumber, setAttendeeNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phone.trim();

    if (!normalizedPhone) {
      setIsSuccess(false);
      setAttendeeNumber(null);
      setMessage("Vui lòng nhập số điện thoại đã đăng ký.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setAttendeeNumber(null);

    const data = await act_XacNhanThamGia(normalizedPhone);
    const result: ConfirmationResult | undefined = Array.isArray(data)
      ? data[0]
      : data;

    setIsSubmitting(false);

    if (!result || Number(result.Success) !== 1) {
      setIsSuccess(false);
      setAttendeeNumber(null);
      setMessage(
        result?.Message ||
          "Không tìm thấy thông tin đăng ký. Vui lòng kiểm tra lại số điện thoại.",
      );
      return;
    }

    const confirmedNumber =
      result.Stt ??
      result.stt ??
      result.STT ??
      result.SoThuTu ??
      result.soThuTu;

    setIsSuccess(true);
    setAttendeeNumber(confirmedNumber?.toString() || null);
    setMessage(result.Message || "Xác nhận tham gia thành công!");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <section className="w-full max-w-lg rounded-3xl border border-white/15 bg-white p-6 shadow-2xl md:p-10">
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase text-blue-800 md:text-4xl">
            Xác nhận tham gia
          </h1>
          <p className="mt-3 text-slate-600">
            Nhập số điện thoại đã dùng để đăng ký sự kiện
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-semibold uppercase">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setMessage("");
              }}
              className="h-12 text-lg"
              disabled={isSubmitting}
            />
          </div>

          {message && (
            <div
              role="status"
              className={`rounded-xl px-4 py-3 text-center font-semibold ${
                isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {isSuccess && attendeeNumber && (
            <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-5 text-center shadow-inner">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Số thứ tự của bạn
              </p>
              <p className="mt-2 font-mono text-5xl font-black text-blue-700">
                {attendeeNumber}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Vui lòng ghi nhớ số này để tham dự quay thưởng
              </p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-base font-bold uppercase"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xác nhận..." : "Xác nhận tham gia"}
          </Button>
        </form>
      </section>
    </main>
  );
}
