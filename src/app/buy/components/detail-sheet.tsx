"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bath,
  Bed,
  Camera,
  Car,
  ChefHat,
  MapPin,
  Square,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DetailSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Thông tin chi tiết</SheetTitle>
        </SheetHeader>
        <Card className="bg-card border-border p-2 overflow-auto rounded-none border-0">
          <div className="relative">
            <Image src={"/house.webp"} width={360} height={360} alt="Logo" />
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              Villa
            </Badge>
            <Link href="/property/midnight-ridge-villa/360">
              <Button
                size="sm"
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white border-0">
                <Camera className="w-4 h-4 mr-2" />
                360° View
              </Button>
            </Link>
          </div>

          <CardHeader className="pb-4 px-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Midnight Ridge Villa
                </h2>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    640 Thamrin, Jakarta, Indonesia
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  $452.00
                </div>
                <div className="text-sm text-muted-foreground">/month</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Welcome to Midnight Ridge Villa! Experience a peaceful
                    escape at Midnight Ridge Villa, a modern retreat set on a
                    quiet hillside with stunning views of rolling hills and
                    starry nights.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">6 Rooms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">4 Beds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">2 Baths</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">2 Kitchen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">2,820 sqft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">1 Garage</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">4.8</span>
                  <span className="text-muted-foreground">(24 reviews)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Guests love the peaceful location and modern amenities.
                </p>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This villa features modern architecture with premium finishes
                  throughout. Located in a quiet residential area with easy
                  access to city amenities.
                </p>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-muted bg-transparent">
                Contact Agent
              </Button>
              <Link
                href="/property/midnight-ridge-villa/360"
                className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-cyan-200 text-cyan-600 hover:bg-cyan-50 bg-transparent">
                  <Camera className="w-4 h-4 mr-2" />
                  360° Tour
                </Button>
              </Link>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Order Now
              </Button>
            </div>

            {/* Map placeholder */}
            <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
              <img
                src="/map-with-location-pin.png"
                alt="Property location map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Midnight Ridge Villa
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
