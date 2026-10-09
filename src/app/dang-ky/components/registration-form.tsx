"use client";

import type React from "react";

import { act_DangKy } from "@/actions/act_user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDate } from "@/lib/format";
import { IDataUser } from "@/lib/lottery-logic";
import { useState } from "react";
import { toast } from "sonner";

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
    attendeeType: "kh",
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

    const user: IDataUser = {
      Stt: "",
      Hoten: formData.fullName,
      NoiCongTac: formData.organization,
      SoDienThoai: formData.phone,
      SoPhieu: null, // nếu có số phiếu thì thay vào
      LoaiDS: formData.attendeeType, // "nv" hoặc "kh"
      NgayTao: formatDate(new Date()), // yyyy-MM-dd HH:mm:ss
      NgayThamDu: null,
      NgayQuaySo: null,
      GiaiTrung: null,
      GiaiFix: null,
      HuyBo: false,
      TrangThai: 1,
    };

    // Simulate API call
    const data = await act_DangKy(user);

    console.log("data === ", data);

    // const randomNum = Math.floor(1000 + Math.random() * 9000);
    let ticketNumber = ``;

    if (data && data.length > 0) {
      ticketNumber = data[0].NewID;
    }

    setIsSubmitting(false);

    if (ticketNumber.toString() === "-1") {
      toast("Thông tin đã được đăng ký!", {
        style: {
          background: "#dc2626", // 🔥 Màu đỏ đậm
          color: "#fff", // Chữ trắng
          border: "1px solid #b91c1c", // Viền đỏ đậm hơn
        },
      });

      return;
    }

    onSuccess(formData, ticketNumber);
  };

  const handleInputChange = (field: string, value: string) => {
    const normalizedValue =
      field === "fullName" || field === "organization"
        ? value.toLocaleUpperCase("vi-VN")
        : value;

    setFormData((prev) => ({ ...prev, [field]: normalizedValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  console.log("formData === ", formData);

  return (
    <div className="container mx-auto p-1 md:p-4 flex flex-col justify-center items-center h-full">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1
            className="mb-1 md:mb-4 text-balance text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight 
            bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
            leading-normal bg-clip-text text-transparent uppercase">
            Đăng ký tham dự sự kiện
          </h1>
          <p className="text-pretty text-xs md:text-xl text-red-600 italic">
            Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký
          </p>
        </div>

        {/* Event Info Cards */}
        {/* <div className="mb-4 grid gap-1 md:gap-4 grid-cols-3">
          <Card className="border-2 py-0 xs:py-2">
            <CardContent className="flex items-center gap-3 p-1 xs:p-4 justify-center">
              <div className="hidden xs:flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-center">
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
              <div className="text-center">
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
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Đã đăng ký
                </p>
                <p className="font-semibold">{DataThamGia.length} người</p>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Registration Form */}
        <Card className="border-2 shadow-lg py-2">
          {/* <CardHeader>
            <CardTitle className="text-2xl">Thông tin đăng ký</CardTitle>
            <CardDescription>
              Điền thông tin của bạn để nhận số phiếu tham dự
            </CardDescription>
          </CardHeader> */}
          <CardContent className="px-2.5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-base uppercase text-blue-600">
                  Họ và tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  autoCapitalize="characters"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`uppercase ${errors.fullName ? "border-destructive" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-base uppercase text-blue-600">
                  Số điện thoại <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`uppercase ${errors.phone ? "border-destructive" : ""}`}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label
                  htmlFor="organization"
                  className="text-base text-blue-600 uppercase">
                  Đơn vị công tác{" "}
                  <span className="text-destructive uppercase">*</span>
                </Label>
                <Input
                  id="organization"
                  autoCapitalize="characters"
                  value={formData.organization}
                  onChange={(e) =>
                    handleInputChange("organization", e.target.value)
                  }
                  className={`uppercase ${errors.organization ? "border-destructive" : ""}`}
                />
                {errors.organization && (
                  <p className="text-sm text-destructive">
                    {errors.organization}
                  </p>
                )}
              </div>

              {/* Attendee Type */}
              <div className="space-y-3">
                <Label className="text-base text-blue-600 uppercase">
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
                    <RadioGroupItem value="kh" id="guest" />
                    <Label htmlFor="guest">Khách mời (Đại biểu)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nv" id="staff" />
                    <Label htmlFor="staff"> Nhân viên bệnh viện</Label>
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
