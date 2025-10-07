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

import { getDataThamGia } from "@/actions/act_data";
import { act_DangKy, act_UpdateUser } from "@/actions/act_user";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { saveAs } from "file-saver";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function NhanVienTable() {
  const { DataAll, setDataAll } = useUserDataStore();

  const [data, setData] = useState<IDataUser[]>([...DataAll]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoai, setFilterLoai] = useState("all");
  const [filterGiai, setFilterGiai] = useState("all");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // mỗi trang 20 item

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeByKey = (
    keyId: string, // Stt
    field: keyof IDataUser,
    value: string | number | boolean | undefined
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item.Stt === keyId ? { ...item, [field]: value } : item
      )
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

      setLoading(true); // bật loading

      await Promise.all(
        await data.map(async (user) => await act_UpdateUser(user))
      );

      setData(data);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false); // tắt loading
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
      console.log("restttttttt ", data);
      if (!data || !data.length) return;
      setLoading(true); // bật loading

      const dataF = data.filter((user) => user.GiaiTrung || user.HuyBo);

      console.log("dataF === ", dataF);

      await Promise.all(
        dataF.map(async (user) => {
          user.GiaiTrung = null;
          user.HuyBo = false;
          user.NgayQuaySo = null;
          await act_UpdateUser(user);
        })
      );

      setData(data);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false); // tắt loading
    }
  };

  const handleFreshData = async () => {
    try {
      if (!data || !data.length) return;
      setLoading(true); // bật loading

      const DATA_THAM_GIA = await getDataThamGia();

      setDataAll(DATA_THAM_GIA);
      setData([...DATA_THAM_GIA]);
      toast("Thành công");
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false); // tắt loading
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const binary = evt.target?.result;
        if (!binary) return;
        setLoading(true);
        const workbook = XLSX.read(binary, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importedData: IDataUser[] = XLSX.utils.sheet_to_json(sheet);

        console.log("importedData ======= ", importedData);

        await Promise.all(
          importedData.map(async (user) => {
            await act_DangKy(user);
          })
        );

        setData(importedData);

        setCurrentPage(1); // reset page khi import
      } catch (ex) {
        console.log(ex);
      } finally {
        setLoading(false); // tắt loading
      }
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
    setData(newData);
  };

  // filter theo search + loại
  const filteredData = data.filter((row) => {
    const matchSearch =
      row.Hoten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.NoiCongTac?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.SoDienThoai?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLoai = filterLoai === "all" || row.LoaiDS === filterLoai;

    // Điều kiện filter giải:
    // - "all": không filter 2 cột này
    // - "a": filter những record có GiaiTrung hoặc GiaiFix thuộc ["db", "1", "2", "3"]
    // - các giá trị khác: filter theo giá trị cụ thể
    let matchGiai = true;
    if (filterGiai === "all") {
      matchGiai = true; // không filter
    } else if (filterGiai === "a") {
      const validGiaiValues = ["db", "1", "2", "3"];
      matchGiai = !!(row.GiaiTrung && validGiaiValues.includes(row.GiaiTrung)) || 
                  !!(row.GiaiFix && validGiaiValues.includes(row.GiaiFix));
    } else {
      matchGiai = row.GiaiFix === filterGiai || row.GiaiTrung === filterGiai;
    }

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
            <SelectValue placeholder="Lọc theo DS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">— Tất cả loại —</SelectItem>
            <SelectItem value="nv">Nhân viên</SelectItem>
            <SelectItem value="kh">Khách mời</SelectItem>
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
            <SelectItem value="all">——</SelectItem>
            <SelectItem value="a">— Tất cả giải —</SelectItem>
            <SelectItem value="db">ĐB - Giải Đặc biệt</SelectItem>
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

        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleSaveAll}>
          Lưu tất cả
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => fileInputRef.current?.click()}>
          Import excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleImportExcel}
        />
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleExportExcel}>
          Export excel
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleReset}>
          Reset data
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleFreshData}>
          Refresh data
        </Button>
      </div>

      <Table className="border border-gray-300 rounded-lg shadow divide-y divide-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border border-gray-300">STT</TableHead>
            <TableHead className="border border-gray-300">Số phiếu</TableHead>
            <TableHead className="border border-gray-300 w-40">
              Họ tên
            </TableHead>
            <TableHead className="border border-gray-300">
              Số điện thoại
            </TableHead>
            <TableHead className="border border-gray-300 w-40">
              Nơi công tác
            </TableHead>
            <TableHead className="border border-gray-300">Loại DS</TableHead>
            {/* <TableHead className="border border-gray-300">Ngày tạo</TableHead> */}
            <TableHead className="border border-gray-300">
              Ngày tham dự
            </TableHead>
            <TableHead className="border border-gray-300">
              Ngày quay số
            </TableHead>
            <TableHead className="border border-gray-300">Giải trúng</TableHead>
            <TableHead className="border border-gray-300">Giải FIX</TableHead>
            <TableHead className="border border-gray-300">Hủy giải</TableHead>
            {/* <TableHead className="border border-gray-300">Trạng thái</TableHead> */}
            <TableHead className="border border-gray-300">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow 
              key={row.Stt} 
              className={`border border-gray-300 ${
                row.TrangThai === -1 
                  ? "italic text-gray-500" // Đã xóa: font in nghiêng
                  : row.GiaiTrung === "db"
                  ? "text-red-600 font-bold" // Giải đặc biệt: màu đỏ, in đậm
                  : row.GiaiTrung === "1"
                  ? "text-blue-600 font-bold" // Giải nhất: màu xanh dương, in đậm
                  : row.GiaiTrung === "2"
                  ? "text-orange-600 font-bold" // Giải nhì: màu cam, in đậm
                  : row.GiaiTrung === "3"
                  ? "text-green-600 font-bold" // Giải ba: màu xanh lá, in đậm
                  : ""
              }`}
            >
              <TableCell className="border border-gray-300 p-0.5 text-center">
                {row.Stt}
              </TableCell>
              
              <TableCell className="w-13 border border-gray-300 p-0">
                <Input
                  className="w-full h-8 border-0 text-center p-0 rounded-none"
                  type="number"
                  value={row.SoPhieu ?? ""}
                  onChange={(e) =>
                    handleChangeByKey(
                      row.Stt,
                      "SoPhieu",
                      Number(e.target.value)
                    )
                  }
                />
              </TableCell>
              <TableCell className="!w-40 border border-gray-300 p-0">
                <Input
                  className="w-40 h-full border-0 rounded-none p-2"
                  value={row.Hoten}
                  onChange={(e) =>
                    handleChangeByKey(row.Stt, "Hoten", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="border border-gray-300 p-0">
                <Input
                  className="w-full h-full border-0 rounded-none p-2"
                  value={row.SoDienThoai}
                  onChange={(e) =>
                    handleChangeByKey(row.Stt, "SoDienThoai", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="!w-40 border border-gray-300 p-0">
                <Input
                  className="w-40 h-full border-0 rounded-none p-2"
                  value={row.NoiCongTac}
                  onChange={(e) =>
                    handleChangeByKey(row.Stt, "NoiCongTac", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="border border-gray-300 p-0">
                <Select
                  value={row.LoaiDS ?? ""}
                  onValueChange={(val) =>
                    handleChangeByKey(row.Stt, "LoaiDS", val)
                  }>
                  <SelectTrigger className="w-full h-full border-0 rounded-none">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nv">Nhân viên</SelectItem>
                    <SelectItem value="kh">Khách mời</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              {/* <TableCell className="border border-gray-300 p-0">
                <Input
                  className="w-22 h-full border-0 rounded-none p-2"
                  type="date"
                  value={
                    row.NgayTao
                      ? new Date(row.NgayTao).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChangeByKey(row.Stt, "NgayTao", e.target.value)
                  }
                />
              </TableCell> */}
              <TableCell className="border border-gray-300 p-0">
                <Input
                  className="w-40 h-full border-0 rounded-none p-2"
                  type="datetime-local"
                  value={
                    row.NgayThamDu
                      ? (() => {
                          const date = new Date(row.NgayThamDu);
                          // Kiểm tra nếu là 31/12/1899 thì để trống
                          if (date.getFullYear() === 1899 && date.getMonth() === 11 && date.getDate() === 31) {
                            return "";
                          }
                          return date.toISOString().slice(0, 16);
                        })()
                      : ""
                  }
                  onChange={(e) =>
                    handleChangeByKey(row.Stt, "NgayThamDu", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="border border-gray-300 p-0">
                <Input
                  className="w-40 h-full border-0 rounded-none p-2"
                  type="datetime-local"
                  value={
                    row.NgayQuaySo
                      ? (() => {
                          const date = new Date(row.NgayQuaySo);
                          // Kiểm tra nếu là 31/12/1899 thì để trống
                          if (date.getFullYear() === 1899 && date.getMonth() === 11 && date.getDate() === 31) {
                            return "";
                          }
                          return date.toISOString().slice(0, 16);
                        })()
                      : ""
                  }
                  onChange={(e) =>
                    handleChangeByKey(row.Stt, "NgayQuaySo", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="border border-gray-300 p-0">
                <Select
                  value={row.GiaiTrung ?? ""}
                  onValueChange={(val) =>
                    handleChangeByKey(
                      row.Stt,
                      "GiaiTrung",
                      val === "-1" ? "" : val
                    )
                  }>
                  <SelectTrigger className="w-full h-full border-0 rounded-none">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">—</SelectItem>
                    <SelectItem value="db">ĐB - Giải Đặc biệt</SelectItem>
                    <SelectItem value="1">1 - Giải nhất</SelectItem>
                    <SelectItem value="2">2 - Giải nhì</SelectItem>
                    <SelectItem value="3">3 - Giải ba</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border border-gray-300 p-0">
                <Select
                  value={row.GiaiFix ?? ""}
                  onValueChange={(val) =>
                    handleChangeByKey(
                      row.Stt,
                      "GiaiFix",
                      val === "-1" ? "" : val // luôn string, không null
                    )
                  }>
                  <SelectTrigger className="w-full h-full border-0 rounded-none">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">—</SelectItem>
                    <SelectItem value="db">ĐB - Giải Đặc biệt</SelectItem>
                    <SelectItem value="1">1 - Giải nhất</SelectItem>
                    <SelectItem value="2">2 - Giải nhì</SelectItem>
                    <SelectItem value="3">3 - Giải ba</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-center">
                <Checkbox
                  checked={row.HuyBo}
                  onCheckedChange={(val) =>
                    handleChangeByKey(row.Stt, "HuyBo", val === true)
                  }
                />
              </TableCell>
              {/* <TableCell className="border border-gray-300 p-0.5 text-center">
                {row.TrangThai === 1 ? row.TrangThai : "Xoá"}
              </TableCell> */}
              <TableCell className="border border-gray-300 p-0.5 text-left">
                <Button
                  variant="outline"
                  className="cursor-pointer font-color-red-600"
                  size="sm"
                  onClick={() => {
                    handleSave(row);
                  }}>
                  Lưu
                </Button>
                {row.TrangThai === -1 ? (
                  <Button
                    variant="outline"
                    className="ml-2 cursor-pointer !font-color-green-600 !font-italic"
                    size="sm"
                    onClick={() => {
                      handlePhucHoi(row);
                    }}>
                    Phục hồi
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="ml-2 cursor-pointer font-color-blue-600"
                    size="sm"
                    onClick={() => {
                      handleDel(row);
                    }}>
                    Xóa
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}>
          Prev
        </Button>

        <span className="font-bold">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>

      <Dialog open={loading} onOpenChange={() => {}}>
        <DialogContent className="w-32 h-32 flex flex-col items-center justify-center gap-2 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Đang xử lý...</span>
        </DialogContent>
      </Dialog>
    </div>
  );
}
