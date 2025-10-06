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

import { act_UpdateUser } from "@/actions/act_user";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function NhanVienTable() {
  const { DataAll, setDataAll } = useUserDataStore();

  const [data, setData] = useState<IDataUser[]>([...DataAll]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoai, setFilterLoai] = useState("all");
  const [filterGiai, setFilterGiai] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // mỗi trang 10 item

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

  const handleSave = (user: IDataUser) => {
    try {
      if (!user) return;

      act_UpdateUser(user);

      handleUpdateUser(user);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleDel = (user: IDataUser) => {
    try {
      if (!user) return;

      user.TrangThai = -1;

      act_UpdateUser(user);

      handleUpdateUser(user);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    }
  };

  const handlePhucHoi = (user: IDataUser) => {
    try {
      if (!user) return;

      user.TrangThai = 1;

      act_UpdateUser(user);

      handleUpdateUser(user);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleSaveAll = async () => {
    try {
      console.log("Save data:", data);
      if (!data || !data.length) return;

      await data.map(async (user) => await act_UpdateUser(user));

      setDataAll(data);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSach");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DanhSach.xlsx");
  };

  const handleReset = async () => {
    try {
      if (!data || !data.length) return;

      await data.map(async (user) => {
        user.GiaiTrung = null;
        user.HuyBo = false;
        user.NgayQuaySo = null;

        await act_UpdateUser(user);
      });

      setDataAll(data);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    }
  };

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

      console.log("importedData ======= ", importedData);

      setData(importedData);
      setCurrentPage(1); // reset page khi import
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (!DataAll || !DataAll.length) return;
    setData(DataAll);
  }, [DataAll]);

  const handleUpdateUser = (updatedUser: IDataUser) => {
    const newData = DataAll.map((user) =>
      user.Stt === updatedUser.Stt ? { ...user, ...updatedUser } : user
    );
    setDataAll(newData);
  };

  // filter theo search + loại
  const filteredData = data.filter((row) => {
    const matchSearch =
      row.Hoten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.NoiCongTac?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.SoDienThoai?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLoai = filterLoai === "all" || row.LoaiDS === filterLoai;

    const matchGiai = filterGiai === "all" || row.GiaiFix === filterGiai;

    return matchSearch && matchLoai && matchGiai;
  });

  // slice data theo phân trang
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2 mb-4 flex-wrap">
        <Input
          placeholder="Tìm kiếm theo tên, nơi công tác, SĐT..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page khi search
          }}
        />

        <Select
          value={filterLoai}
          onValueChange={(val) => {
            setFilterLoai(val);
            setCurrentPage(1); // reset page khi filter
          }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">— Tất cả loại —</SelectItem>
            <SelectItem value="nv">nv - Nhân viên</SelectItem>
            <SelectItem value="kh">kh - Khách mời</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterGiai}
          onValueChange={(val) => {
            setFilterGiai(val);
            setCurrentPage(1); // reset page khi filter
          }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo giải" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">— Tất cả giải —</SelectItem>
            <SelectItem value="db">db - Giải Đặc biệt</SelectItem>
            <SelectItem value="1">1 - Giải nhất</SelectItem>
            <SelectItem value="2">2 - Giải nhì</SelectItem>
            <SelectItem value="3">3 - Giải ba</SelectItem>
          </SelectContent>
        </Select>

        {/* <Button
          onClick={() =>
            setData((prev) => [
              ...prev,
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
        </Button> */}

        <Button onClick={handleSaveAll}>Lưu tất cả</Button>
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
        <Button onClick={handleReset}>Reset data</Button>
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
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, i) => (
            <TableRow key={row.Stt}>
              <TableCell>{row.Stt}</TableCell>
              <TableCell>
                <Input
                  value={row.Hoten}
                  onChange={(e) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "Hoten",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={row.NoiCongTac}
                  onChange={(e) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "NoiCongTac",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  className="w-18"
                  type="number"
                  value={row.SoPhieu ?? ""}
                  onChange={(e) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "SoPhieu",
                      Number(e.target.value)
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={row.LoaiDS ?? ""}
                  onValueChange={(val) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "LoaiDS",
                      val
                    )
                  }>
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
                  className="w-28"
                  value={row.SoDienThoai}
                  onChange={(e) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "SoDienThoai",
                      e.target.value
                    )
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
                  onChange={(e) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "NgayTao",
                      e.target.value
                    )
                  }
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
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "NgayThamDu",
                      e.target.value
                    )
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
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "NgayQuaySo",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={row.GiaiTrung ?? ""}
                  onValueChange={(val) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "GiaiTrung",
                      val === "-1" ? "" : val
                    )
                  }>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chọn giải" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">— Không chọn —</SelectItem>
                    <SelectItem value="db">db - Giải Đặc biệt</SelectItem>
                    <SelectItem value="1">1 - Giải nhất</SelectItem>
                    <SelectItem value="2">2 - Giải nhì</SelectItem>
                    <SelectItem value="3">3 - Giải ba</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.GiaiFix ?? ""}
                  onValueChange={(val) =>
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "GiaiFix",
                      val === "-1" ? "" : val // luôn string, không null
                    )
                  }>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chọn giải" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">— Không chọn —</SelectItem>
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
                    handleChange(
                      i + (currentPage - 1) * pageSize,
                      "HuyBo",
                      val === true
                    )
                  }
                />
              </TableCell>
              <TableCell>
                {row.TrangThai === 1 ? row.TrangThai : "Xoá"}
              </TableCell>
              <TableCell>
                <Button
                  className="cursor-pointer"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    handleSave(row);
                  }}>
                  Lưu
                </Button>
                <Button
                  className="ml-2 cursor-pointer bg-blue-600"
                  size="sm"
                  onClick={() => {
                    handlePhucHoi(row);
                  }}>
                  Phục hồi
                </Button>
                <Button
                  className="ml-2 cursor-pointer"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDel(row);
                  }}>
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}>
          Prev
        </Button>

        <span className="font-bold">
          {currentPage} / {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
