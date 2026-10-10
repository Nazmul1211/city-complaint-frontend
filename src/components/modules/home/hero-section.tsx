"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeAdaptiveImage } from "@/components/ui/theme-adaptive-image";

interface ActiveHotspot {
  id: string;
  code: string;
  title: string;
  ward: string;
  department: string;
  status: "IN_PROGRESS" | "DISPATCHED" | "RESOLVED";
  technician: string;
  slaLeft: string;
  xPercent: number;
  yPercent: number;
}

const LIVE_HOTSPOTS: ActiveHotspot[] = [
  {
    id: "1",
    code: "CCR-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    ward: "Ward 12 (Mirpur)",
    department: "Public Works & Roads",
    status: "IN_PROGRESS",
    technician: "Md. Rahim Uddin (Field Tech)",
    slaLeft: "18h 24m SLA left",
    xPercent: 54,
    yPercent: 46,
  },
  {
    id: "2",
    code: "CCR-2026-0884",
    title: "Faulty Transformer & Streetlight Strip",
    ward: "Ward 08 (Gulshan)",
    department: "Electrical Division",
    status: "DISPATCHED",
    technician: "Tanvir Ahmed (Zone Lead)",
    slaLeft: "11h 10m SLA left",
    xPercent: 78,
    yPercent: 32,
  },
  {
    id: "3",
    code: "CCR-2026-0873",
    title: "Overflowing Garbage Dumpster on Road 7",
    ward: "Ward 19 (Banani)",
    department: "Solid Waste Management",
    status: "RESOLVED",
    technician: "Suman Mia (Sanitation Lead)",
    slaLeft: "Completed in 8h",
    xPercent: 32,
    yPercent: 68,
  },
];

export function HeroSection() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [selectedHotspot, setSelectedHotspot] = useState<ActiveHotspot>(
    LIVE_HOTSPOTS[0]
  );

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      router.push("/track");
      return;
    }
    router.push(`/track?trackingId=${encodeURIComponent(trackingId.trim())}`);
  };

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background to-muted/20 py-12 md:py-20 lg:py-24">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20"
      >
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-600/20 to-teal-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Civic Messaging & Triage Input */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            {/* Official Municipal Authority Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-900 shadow-sm backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-200">
              <span className="flex size-2 rounded-full bg-sky-500 animate-pulse" />
              <ShieldCheck className="size-3.5 text-sky-600 dark:text-sky-400" />
              <span>Official Municipal Citizen Service Portal • Ward-Level GIS</span>
            </div>

            {/* High-Impact Civic Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Report it. Track it.{" "}
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-cyan-300">
                Get it resolved.
              </span>
            </h1>

            {/* Subtitle with transparent civic value prop */}
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Submit public service complaints directly to municipal authorities,
              track verified field technician progress in real time, and audit
              completed repairs with photographic evidence and SLA accountability.
            </p>

            {/* Quick Tracking Search Bar (Primary Instant Triage) */}
            <form
              onSubmit={handleTrackSubmit}
              className="mx-auto flex max-w-xl flex-col gap-2 rounded-xl border bg-card/90 p-2 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800 lg:mx-0"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter complaint number (e.g. REQ-2026-0891)"
                  className="h-11 w-full rounded-lg bg-transparent pl-10 pr-4 text-sm font-medium uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button type="submit" size="default" className="gap-2 font-medium shrink-0">
                <Search className="size-4" />
                Track Status
              </Button>
            </form>

            {/* Dual Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
              <Link href="/dashboard/submit-request">
                <Button size="lg" className="gap-2 font-semibold shadow-sm">
                  Report a Civic Issue
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/track">
                <Button variant="outline" size="lg" className="gap-2 font-medium">
                  <Compass className="size-4" />
                  Public Live Tracker
                </Button>
              </Link>
              <Link href="/departments">
                <Button variant="ghost" size="lg" className="gap-2 font-medium text-muted-foreground hover:text-foreground">
                  <Building2 className="size-4" />
                  City Departments
                </Button>
              </Link>
            </div>

            {/* Trust Guarantee Badges */}
            <div className="grid grid-cols-1 gap-3 border-t pt-6 text-xs text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Clock className="size-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span className="font-medium text-foreground">24–48h SLA Triage</span>
              </div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-foreground">Photo-Verified Proof</span>
              </div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Radio className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-medium text-foreground">Live Field Radar</span>
              </div>
            </div>
          </div>

          {/* Right Column: Theme-Adaptive GIS Map Activity Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow & Card Container */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-card p-3 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/90">
                {/* Header Strip with Live Civic Activity Status */}
                <div className="mb-3 flex items-center justify-between border-b pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="font-bold tracking-tight text-foreground">
                      Municipal Live Radar
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      • Ward 12 Mirpur Sector
                    </span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                    GIS SYNCED
                  </Badge>
                </div>

                {/* Theme-Adaptive Map Canvas with Hotspot Overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200/60 bg-slate-950 dark:border-slate-800">
                  <ThemeAdaptiveImage
                    lightSrc="/images/civic/map-light.png"
                    darkSrc="/images/civic/map-dark.png"
                    alt="CityCare Municipal GIS Live Activity Map"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center transition-transform duration-500"
                  />

                  {/* Dark gradient vignette overlay for readability */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

                  {/* Live Hotspot Pins */}
                  {LIVE_HOTSPOTS.map((hotspot) => {
                    const isSelected = selectedHotspot.id === hotspot.id;
                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        onClick={() => setSelectedHotspot(hotspot)}
                        style={{
                          left: `${hotspot.xPercent}%`,
                          top: `${hotspot.yPercent}%`,
                        }}
                        className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                          isSelected ? "scale-125 z-20" : "scale-100 hover:scale-110 z-10"
                        }`}
                        title={`${hotspot.code}: ${hotspot.title}`}
                      >
                        <span className="relative flex size-5 items-center justify-center">
                          {isSelected && (
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-80" />
                          )}
                          <span
                            className={`flex size-4 items-center justify-center rounded-full border-2 border-white shadow-md ${
                              hotspot.status === "RESOLVED"
                                ? "bg-emerald-500"
                                : hotspot.status === "DISPATCHED"
                                ? "bg-amber-500"
                                : "bg-sky-500"
                            }`}
                          >
                            <span className="size-1.5 rounded-full bg-white" />
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Pinned Case Overlay Card (Floating within map) */}
                  <div className="absolute inset-x-2.5 bottom-2.5 z-20 rounded-lg border border-white/10 bg-slate-950/90 p-3 text-white shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-sky-400">
                        <MapPin className="size-3 text-sky-400 shrink-0" />
                        <span>{selectedHotspot.code}</span>
                      </div>
                      <Badge
                        variant={
                          selectedHotspot.status === "RESOLVED"
                            ? "success"
                            : selectedHotspot.status === "DISPATCHED"
                            ? "warning"
                            : "info"
                        }
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {selectedHotspot.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-100">
                      {selectedHotspot.title}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Wrench className="size-3 text-sky-400" />
                        {selectedHotspot.department}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-emerald-400">
                        <Clock className="size-3" />
                        {selectedHotspot.slaLeft}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-card: Assigned Field Technician Info */}
                <div className="mt-3 flex items-center justify-between rounded-lg border bg-muted/40 p-2.5 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserCheck className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Assigned Field Technician
                      </p>
                      <p className="font-semibold text-foreground">
                        {selectedHotspot.technician}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/track?trackingId=${selectedHotspot.code}`}
                    className="font-mono text-[11px] font-medium text-primary hover:underline"
                  >
                    View audit →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
