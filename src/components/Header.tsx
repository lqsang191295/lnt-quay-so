import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { BellIcon, MessageSquareTextIcon } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full h-full flex flex-row border-b-1 py-4 items-center gap-2">
      <div className="flex-1 flex items-center">
        {/* Logo */}
        <div className="flex flex-row gap-2 w-80 cursor-pointer pl-4">
          <Image
            className=""
            src={"/next.svg"}
            width={36}
            height={36}
            alt="Logo"
          />
          <Label className="text-black/80">Bds Viet Nam</Label>
        </div>
        {/* Menu */}
        <div className="flex flex-row gap-2 border-1 p-1 rounded-4xl w-auto bg-[#f6f8fc]">
          {["Mua bán / Cho thuê", "Luật nhà đất"].map((item, i) => {
            return (
              <Label
                className={`px-4 py-1 ${
                  i == 0
                    ? "border-1 rounded-4xl bg-white text-blue-600 font-semibold"
                    : "text-black/80"
                }`}
                key={i}>
                {item}
              </Label>
            );
          })}
        </div>
      </div>
      {/* Right bar */}
      <div className="flex flex-row gap-2 pr-4">
        <Input className="rounded-4xl" type="text" placeholder="Search" />
        <Button
          variant="secondary"
          size="icon"
          className="size-8 rounded-full border-1 text-black/80">
          <MessageSquareTextIcon />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-8 rounded-full border-1 text-black/80">
          <BellIcon />
        </Button>
      </div>
    </div>
  );
}
