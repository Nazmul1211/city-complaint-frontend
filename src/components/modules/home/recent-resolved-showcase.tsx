"use client";

import {
  ArrowRight,
  Building2,
  Clock,
  MapPin,
  MoveHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResolvedCase {
  requestNo: string;
  title: string;
  department: string;
  ward: string;
  completionText: string;
  thumbnail: string;
  beforePhoto: string;
  afterPhoto: string;
  technicianNote: string;
}

const CASES: ResolvedCase[] = [
  {
    requestNo: "CCR-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    department: "Public Works & Road Maintenance",
    ward: "Ward 12",
    completionText: "Completed in 24 hrs (SLA: 48h)",
    thumbnail: "/images/civic/pothole-before.jpg",
    beforePhoto: "/images/civic/pothole-before.jpg",
    afterPhoto: "/images/civic/pothole-after.jpg",
    technicianNote:
      "Asphalt patch poured, steam-roller compacted, and lane reopened.",
  },
  {
    requestNo: "CCR-2026-0884",
    title: "Faulty Transformer & Dark Streetlight Strip",
    department: "Electrical & Street Lighting",
    ward: "Ward 08",
    completionText: "Completed in 14 hrs (SLA: 24h)",
    thumbnail: "/images/civic/streetlight-before.jpg",
    beforePhoto: "/images/civic/streetlight-before.jpg",
    afterPhoto: "/images/civic/streetlight-after.jpg",
    technicianNote:
      "Capacitor replaced on sub-station feeder 3; 12 LED poles restored.",
  },
  {
    requestNo: "CCR-2026-0873",
    title: "Overflowing Garbage Dumpster on Road 7",
    department: "Solid Waste Management",
    ward: "Ward 19",
    completionText: "Completed in 8 hrs (SLA: 12h)",
    thumbnail: "/images/civic/sanitation-before.jpg",
    beforePhoto: "/images/civic/sanitation-before.jpg",
    afterPhoto: "/images/civic/sanitation-after.jpg",
    technicianNote:
      "Compactor truck cleared 4.5 tons of overflow; area bleached and sanitized.",
  },
];

function SplitComparisonImage({
  beforePhoto,
  afterPhoto,
  alt,
}: {
  beforePhoto: string;
  afterPhoto: string;
  alt: string;
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group/slider relative aspect-[16/9] w-full cursor-ew-resize overflow-hidden rounded-lg bg-slate-950 select-none"
    >
      {/* After Image (Full width background) */}
      <Image
        src={afterPhoto}
        alt={`${alt} After repair`}
        fill
        className="object-cover"
      />

      {/* Before Image (Clipped by slider position) */}
      <div
        style={{ width: `${sliderPos}%` }}
        className="absolute inset-y-0 left-0 overflow-hidden"
      >
        <div className="relative h-full w-[350px] sm:w-[400px] lg:w-[450px]">
          <Image
            src={beforePhoto}
            alt={`${alt} Before repair`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Floating Pill Labels */}
      <div className="pointer-events-none absolute left-2.5 bottom-2.5 z-10 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
        Before
      </div>
      <div className="pointer-events-none absolute right-2.5 bottom-2.5 z-10 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
        After
      </div>

      {/* Vertical Slider Line & Center Circular Handle */}
      <div
        style={{ left: `${sliderPos}%` }}
        className="pointer-events-none absolute inset-y-0 -translate-x-1/2 z-20 flex items-center justify-center"
      >
        <div className="h-full w-0.5 bg-white shadow-md" />
        <div className="absolute flex size-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-lg">
          <MoveHorizontal className="size-3.5" />
        </div>
      </div>
    </div>
  );
}

export function RecentResolvedShowcase() {
  return (
    <section className="border-b bg-muted/20 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Recently resolved in your city
            </h2>
            <p className="text-sm text-muted-foreground">
              See how civic complaints in different wards are being inspected and resolved daily.
            </p>
          </div>

          <Link href="/track">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg border-border font-semibold text-foreground hover:bg-muted"
            >
              View all resolutions
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* 3 Case Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((item) => (
            <Card
              key={item.requestNo}
              className="flex flex-col justify-between overflow-hidden border border-border/80 bg-card shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
            >
              <CardContent className="space-y-3.5 p-4">
                {/* Top status bar */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    RESOLVED
                  </span>
                  <Link
                    href={`/track?trackingId=${item.requestNo}`}
                    className="font-mono text-xs font-bold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
                  >
                    {item.requestNo}
                  </Link>
                </div>

                {/* Case Info with Square Thumbnail */}
                <div className="flex items-start gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Building2 className="size-3 shrink-0" />
                      <span className="truncate">{item.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      <span>{item.ward}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Clock className="size-3 shrink-0" />
                      <span>{item.completionText}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Split Slider Container */}
                <SplitComparisonImage
                  beforePhoto={item.beforePhoto}
                  afterPhoto={item.afterPhoto}
                  alt={item.title}
                />

                {/* Technician Work Note */}
                <div className="rounded-md border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Technician Note:{" "}
                  </span>
                  {item.technicianNote}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
