"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function EventCheckInPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    type: "staff",
  });
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = Math.floor(1000 + Math.random() * 9000);
    setTicketNumber(randomTicket);
  };

  if (ticketNumber) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-green-600">
              🎉 Đăng ký thành công!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Xin chào{" "}
              <span className="font-semibold">{form.name || "Bạn"}</span>
            </p>
            <p className="text-gray-700">Số phiếu tham dự của bạn là:</p>
            <p className="text-5xl font-bold text-blue-600 my-4">
              {ticketNumber}
            </p>
            <p className="text-sm text-gray-500">
              Vui lòng chụp màn hình hoặc lưu lại số phiếu để tham gia quay số.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => {
                setTicketNumber(null);
                setForm({ name: "", phone: "", company: "", type: "staff" });
              }}>
              Đăng ký thêm người khác
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-blue-600">
            📝 Check-in Sự Kiện
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                placeholder="VD: 0912345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Đơn vị công tác</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="VD: Bệnh viện A"
              />
            </div>

            <div className="space-y-2">
              <Label>Bạn là:</Label>
              <RadioGroup
                defaultValue="staff"
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
                className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff">Nhân viên BV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="guest" id="guest" />
                  <Label htmlFor="guest">Khách mời</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full">
              Đăng ký tham dự
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
