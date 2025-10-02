"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface RegistrationFormProps {
  onSuccess: (
    data: {
      fullName: string;
      phone: string;
      organization: string;
      attendeeType: string;
    },
    ticketNumber: string
  ) => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    organization: "",
    attendeeType: "staff",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Vui lòng nhập đơn vị công tác";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `${randomNum}`;

    setIsSubmitting(false);
    onSuccess(formData, ticketNumber);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="container mx-auto p-1 md:p-4 flex flex-col justify-center items-center h-full">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1
            className="mb-1 md:mb-4 text-balance text-xl md:text-4xl font-bold tracking-tight lg:text-6xl 
            bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
            leading-normal
            bg-clip-text text-transparent ">
            Đăng ký tham dự sự kiện
          </h1>
          <p className="text-pretty text-xs md:text-xl text-red-600">
            Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký
          </p>
        </div>

        {/* Event Info Cards */}
        <div className="mb-4 grid gap-1 md:gap-4 grid-cols-3">
          <Card className="border-2 py-0 xs:py-2">
            <CardContent className="flex items-center gap-3 p-1 xs:p-4 justify-center">
              <div className="hidden xs:flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Thời gian
                </p>
                <p className="font-semibold">15/03/2025</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 py-0 xs:py-2">
            <CardContent className="flex items-center gap-3 p-1 xs:p-4 justify-center">
              <div className="hidden xs:flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Địa điểm
                </p>
                <p className="font-semibold">Hội trường A</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 py-0 xs:py-2">
            <CardContent className="flex items-center gap-3 p-1 xs:p-4 justify-center">
              <div className="hidden xs:flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã đăng ký
                </p>
                <p className="font-semibold">248 người</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="border-2 shadow-lg py-2">
          <CardHeader>
            <CardTitle className="text-2xl">Thông tin đăng ký</CardTitle>
            <CardDescription>
              Điền thông tin của bạn để nhận số phiếu tham dự
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base uppercase">
                  Họ và tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base uppercase">
                  Số điện thoại <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-base">
                  Đơn vị công tác{" "}
                  <span className="text-destructive uppercase">*</span>
                </Label>
                <Input
                  id="organization"
                  placeholder="Bệnh viện Đa khoa Trung ương"
                  value={formData.organization}
                  onChange={(e) =>
                    handleInputChange("organization", e.target.value)
                  }
                  className={errors.organization ? "border-destructive" : ""}
                />
                {errors.organization && (
                  <p className="text-sm text-destructive">
                    {errors.organization}
                  </p>
                )}
              </div>

              {/* Attendee Type */}
              <div className="space-y-3">
                <Label className="text-base">
                  Người tham dự <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  defaultValue="staff"
                  value={formData.attendeeType}
                  onValueChange={(value) =>
                    handleInputChange("attendeeType", value)
                  }
                  className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff"> Nhân viên bệnh viện</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guest" id="guest" />
                    <Label htmlFor="guest">Khách mời (Đại biểu)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-semibold 
                bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 cursor-pointer"
                disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
