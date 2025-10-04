"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IDataUser } from "@/lib/lottery-logic";
import { useUserDataStore } from "@/store/data-user";
import { useEffect, useRef, useState } from "react";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function NhanVienTable() {
  const { DataThamGia } = useUserDataStore();

  const [data, setData] = useState<IDataUser[]>([...DataThamGia]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoai, setFilterLoai] = useState("all");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    index: number,
    key: keyof IDataUser,
    value: string | number | boolean | undefined
  ) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = () => {
    console.log("Save data:", data);
    // TODO: call API lưu vào DB
  };

  // ✅ Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSach");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DanhSach.xlsx");
  };

  // ✅ Import Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binary = evt.target?.result;
      if (!binary) return;

      const workbook = XLSX.read(binary, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData: IDataUser[] = XLSX.utils.sheet_to_json(sheet);

      setData(importedData);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (!DataThamGia || !DataThamGia.length) return;
    setData(DataThamGia);
  }, [DataThamGia]);

  // ✅ Filter theo search + loại
  const filteredData = data.filter((row) => {
    const matchSearch =
      row.Hoten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.NoiCongTac?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.SoDienThoai?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLoai = filterLoai === "all" || row.LoaiDS === filterLoai;

    return matchSearch && matchLoai;
  });

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên, nơi công tác, SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select value={filterLoai} onValueChange={setFilterLoai}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="nv">nv - Nhân viên</SelectItem>
            <SelectItem value="kh">kh - Khách mời</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() =>
            setData([
              ...data,
              {
                Stt: (data.length + 1).toString(),
                Hoten: "",
                NoiCongTac: "",
                SoPhieu: 0,
                LoaiDS: "",
                NgayTao: new Date().toISOString().slice(0, 10),
                NgayThamDu: "",
                NgayQuaySo: "",
                GiaiTrung: "",
                GiaiFix: "",
                SoDienThoai: "",
                HuyBo: false,
                TrangThai: 1,
              },
            ])
          }>
          Thêm nhân viên
        </Button>

        <Button onClick={handleSave}>Lưu</Button>
        <Button onClick={() => fileInputRef.current?.click()}>
          Import excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleImportExcel}
        />
        <Button onClick={handleExportExcel}>Export excel</Button>
      </div>

      <Table className="border rounded-lg shadow">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Nơi công tác</TableHead>
            <TableHead>Số phiếu</TableHead>
            <TableHead>Loại DS</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày tham dự</TableHead>
            <TableHead>Ngày quay số</TableHead>
            <TableHead>Giải trúng</TableHead>
            <TableHead>Giải fix</TableHead>
            <TableHead>Hủy bỏ</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row, i) => (
            <TableRow key={row.Stt}>
              <TableCell>{row.Stt}</TableCell>
              <TableCell>
                <Input
                  value={row.Hoten}
                  onChange={(e) => handleChange(i, "Hoten", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={row.NoiCongTac}
                  onChange={(e) =>
                    handleChange(i, "NoiCongTac", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.SoPhieu ?? ""}
                  onChange={(e) =>
                    handleChange(i, "SoPhieu", Number(e.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={row.LoaiDS ?? undefined}
                  onValueChange={(val) => handleChange(i, "LoaiDS", val)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nv">nv - Nhân viên</SelectItem>
                    <SelectItem value="kh">kh - Khách mời</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  value={row.SoDienThoai}
                  onChange={(e) =>
                    handleChange(i, "SoDienThoai", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={
                    row.NgayTao
                      ? new Date(row.NgayTao).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleChange(i, "NgayTao", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={
                    row.NgayThamDu
                      ? new Date(row.NgayThamDu).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(i, "NgayThamDu", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={
                    row.NgayQuaySo
                      ? new Date(row.NgayQuaySo).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(i, "NgayQuaySo", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={row.GiaiTrung ?? undefined}
                  onValueChange={(val) => handleChange(i, "GiaiTrung", val)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chọn giải" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="db">db - Giải Đặc biệt</SelectItem>
                    <SelectItem value="1">1 - Giải nhất</SelectItem>
                    <SelectItem value="2">2 - Giải nhì</SelectItem>
                    <SelectItem value="3">3 - Giải ba</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.GiaiFix ?? undefined}
                  onValueChange={(val) => handleChange(i, "GiaiFix", val)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chọn giải" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="db">db - Giải Đặc biệt</SelectItem>
                    <SelectItem value="1">1 - Giải nhất</SelectItem>
                    <SelectItem value="2">2 - Giải nhì</SelectItem>
                    <SelectItem value="3">3 - Giải ba</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={row.HuyBo}
                  onCheckedChange={(val) =>
                    handleChange(i, "HuyBo", val === true)
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setData(data.filter((_, idx) => idx !== i));
                  }}>
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
