"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toPng } from "html-to-image";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useRef } from "react";

interface TicketDisplayProps {
  ticketNumber: string;
  registrationData: {
    fullName: string;
    phone: string;
    organization: string;
    attendeeType: string;
  };
  onBack: () => void;
}

export function TicketDisplay({
  ticketNumber,
  registrationData,
  onBack,
}: TicketDisplayProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Số phiếu tham dự sự kiện",
          text: `Số phiếu của tôi: ${ticketNumber}`,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2, // tăng độ nét
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "ticket.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="mx-auto max-w-2xl">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <h1
            className="mb-1 md:mb-4 text-balance text-2xl md:text-3xl font-bold tracking-tight lg:text-5xl 
            bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
            leading-normal bg-clip-text text-transparent uppercase">
            Đăng ký thành công!
          </h1>
          <p className="text-pretty text-xs md:text-xl text-red-600 italic">
            Vui lòng chụp màn hình.
          </p>
          <p className="text-pretty text-xs md:text-xl text-red-600 italic">
            Lưu lại số phiếu này để tham dự quay số.
          </p>
        </div>

        {/* Ticket Card */}
        <Card
          ref={ticketRef}
          className="relative overflow-hidden border-2 shadow-2xl py-2">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent" />
          </div>

          <CardContent className="relative px-8 py-2">
            {/* Ticket Number - Large Display */}
            <div className="mb-2 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-600">
                Số thứ tự
              </p>
              <div className="rounded-lg bg-accent/10 p-1 xs:px-4">
                <p className="font-mono text-3xl font-bold tracking-wider md:text-4xl text-blue-600">
                  {ticketNumber}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative p-2 xs:mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">
                  Thông tin đăng ký
                </span>
              </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-4">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="font-medium text-muted-foreground uppercase">
                  Họ và tên:
                </span>
                <span className="font-semibold">
                  {registrationData.fullName}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="font-medium text-muted-foreground uppercase">
                  Số điện thoại:
                </span>
                <span className="font-semibold">{registrationData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="font-medium text-muted-foreground uppercase">
                  Đơn vị:
                </span>
                <span className="font-semibold">
                  {registrationData.organization}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="font-medium text-muted-foreground uppercase">
                  Loại:
                </span>
                <span className="font-semibold">
                  {registrationData.attendeeType === "nv"
                    ? "Nhân viên bệnh viện"
                    : "Khách mời (Đại biểu)"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="w-full bg-transparent">
            <Share2 className="mr-2 h-5 w-5" />
            Chia sẻ
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownload}
            className="w-full bg-transparent">
            <Download className="mr-2 h-5 w-5" />
            Tải xuống
          </Button>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Đăng ký người khác
          </Button>
        </div>
      </div>
    </div>
  );
}
