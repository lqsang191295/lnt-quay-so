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

    // Generate ticket number (format: EVT-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `EVT-${dateStr}-${randomNum}`;

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
    <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Đăng ký tham dự sự kiện
          </h1>
          <p className="text-pretty text-lg text-muted-foreground md:text-xl">
            Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký
          </p>
        </div>

        {/* Event Info Cards */}
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <Card className="border-2 py-2">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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

          <Card className="border-2 py-2">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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

          <Card className="border-2 py-2">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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
        <Card className="border-2 shadow-lg">
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
                <Label htmlFor="fullName" className="text-base">
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
                <Label htmlFor="phone" className="text-base">
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
                  Đơn vị công tác <span className="text-destructive">*</span>
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
                className="w-full text-base font-semibold"
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
