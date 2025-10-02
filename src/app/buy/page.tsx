"use client";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  DollarSign,
  HeartIcon,
  Home,
  MapPin,
  MapPinIcon,
  Maximize,
  StarIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DetailSheet from "./components/detail-sheet";

export default function Page() {
  const [priceRange, setPriceRange] = useState([10]);
  const [selectedLocations, setSelectedLocations] = useState([
    "Jakarta, Indonesia",
    "Semarang, Indonesia",
  ]);
  const [selectedTypes, setSelectedTypes] = useState([
    "Single Family Home",
    "Condo/Townhouse",
    "Apartment",
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState(["Garden"]);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <div>
        <Header />
      </div>
      {/* body */}
      <div className="flex flex-1 overflow-hidden">
        {/* filter */}
        <div className="w-80 border-r-1 border-[#eeeeee] overflow-y-auto">
          <div className="flex justify-between px-2 py-4 border-b-1 border-[#eeeeee]">
            <Label>Custom Filter</Label>
            <Label className="text-[#234afc]">Clear all</Label>
          </div>
          <div className="">
            {/* Filter */}
            <div className="p-4 bg-card border-border border-b-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Location</Label>
                </div>
                <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>

              <div className="space-y-2">
                {selectedLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">{location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="p-4 bg-card border-border border-b-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Price Range</Label>
                </div>
                <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Under $1,000
                  </div>
                  <div className="text-sm text-muted-foreground">
                    $1,000 - $15,000
                  </div>
                  <div className="text-sm text-muted-foreground">
                    More Than $15,000
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">Custom</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$10k</span>
                    <span>$50k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Land Area Filter */}
            <div className="p-4 bg-card border-border border-b-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Maximize className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Land Area</Label>
                </div>
                <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input placeholder="sq ft" className="text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input placeholder="sq ft" className="text-sm" />
                </div>
              </div>
            </div>

            {/* Type of Place Filter */}
            <div className="p-4 bg-card border-border border-b-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Type Of Place</Label>
                </div>
                <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>

              <div className="space-y-3">
                {[
                  "Single Family Home",
                  "Condo/Townhouse",
                  "Apartment",
                  "Bungalow",
                ].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label className="text-sm text-foreground">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="p-4 bg-card border-border border-b-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-muted-foreground/20"></div>
                  <Label className="text-sm font-medium">Amenities</Label>
                </div>
                <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>

              <div className="flex flex-wrap gap-2">
                {["Garden", "Gym", "Garage"].map((amenity) => (
                  <button
                    key={amenity}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: selectedAmenities.includes(amenity)
                        ? "#0891b2"
                        : "#f9fafb",
                      color: selectedAmenities.includes(amenity)
                        ? "#ffffff"
                        : "#374151",
                      borderColor: selectedAmenities.includes(amenity)
                        ? "#0891b2"
                        : "#d1d5db",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAmenities.includes(amenity)) {
                        e.currentTarget.style.backgroundColor = "#0e7490";
                      } else {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAmenities.includes(amenity)) {
                        e.currentTarget.style.backgroundColor = "#0891b2";
                      } else {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onClick={() => {
                      if (selectedAmenities.includes(amenity)) {
                        setSelectedAmenities(
                          selectedAmenities.filter((a) => a !== amenity)
                        );
                      } else {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      }
                    }}>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="overflow-y-auto grid grid-cols-4 gap-4 flex-1 bg-[#f6f8fc] p-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              onClick={() => setOpen(true)}
              className="w-full cursor-pointer aspect-square">
              <div className="relative w-full h-full rounded-lg overflow-hidden box-real">
                <Image
                  src="/house.webp"
                  alt="House"
                  fill
                  className="object-cover"
                />
                <Badge
                  className="absolute top-2 left-2 rounded-4xl"
                  variant="secondary">
                  Villa
                </Badge>
                <div className="p-2 absolute bottom-0 w-full">
                  <div className="bg-white w-full rounded-lg p-3 flex gap-3 flex-col">
                    <div className="flex">
                      <div className="flex flex-col flex-1 gap-1">
                        <Label>Dream House Reaity</Label>
                        <div className="flex gap-1">
                          <MapPinIcon className="text-blue-600" size={15} />
                          <Label>Evegreen 14, Jakarta.</Label>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-8 rounded-full border-1 cursor-pointer">
                          <HeartIcon />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Label>$375</Label>
                      <div className="flex gap-0.5">
                        <StarIcon size={15} className="text-yellow-500" />
                        <Label>4.7/5</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DetailSheet open={open} setOpen={setOpen} />
    </div>
  );
}
