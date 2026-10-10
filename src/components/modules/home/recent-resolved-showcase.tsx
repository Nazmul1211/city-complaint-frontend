"use client";

import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResolvedCase {
  requestNo: string;
  title: string;
  department: string;
  ward: string;
  turnaround: string;
  slaTarget: string;
  technician: string;
  technicianRole: string;
  resolutionNote: string;
  date: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}

const RECENT_RESOLVED_CASES: ResolvedCase[] = [
  {
    requestNo: "REQ-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    department: "Public Works & Road Maintenance",
    ward: "Ward 12 (Mirpur)",
    turnaround: "24 hrs",
    slaTarget: "SLA: 48h",
    technician: "Md. Rahim Uddin",
    technicianRole: "Lead Field Technician",
    resolutionNote:
      "Asphalt patch poured, steam-roller compacted flush with surface, and road lane reopened.",
    date: "Completed Today, 09:30 AM",
    beforeImage: "/images/civic/pothole-before.jpg",
    afterImage: "/images/civic/pothole-after.jpg",
    beforeAlt: "Deep pothole damage on road asphalt",
    afterAlt: "Repaired asphalt surface with fresh seal and lane paint",
  },
  {
    requestNo: "REQ-2026-0884",
    title: "Faulty Transformer & Dark Streetlight Strip",
    department: "Electrical & Street Lighting",
    ward: "Ward 08 (Gulshan)",
    turnaround: "14 hrs",
    slaTarget: "SLA: 24h",
    technician: "Tanvir Ahmed",
    technicianRole: "Zone Electrical Specialist",
    resolutionNote:
      "Capacitor and fuse replaced on sub-station feeder 3; 12 high-efficiency LED luminaires restored.",
    date: "Completed Yesterday, 08:15 PM",
    beforeImage: "/images/civic/streetlight-before.jpg",
    afterImage: "/images/civic/streetlight-after.jpg",
    beforeAlt: "Dark unlit street with broken streetlight",
    afterAlt: "Brightly illuminated city street with repaired LED fixture",
  },
  {
    requestNo: "REQ-2026-0873",
    title: "Overflowing Garbage Dumpster on Road 7",
    department: "Solid Waste Management",
    ward: "Ward 19 (Banani)",
    turnaround: "8 hrs",
    slaTarget: "SLA: 12h",
    technician: "Suman Mia",
    technicianRole: "Sanitation Squad Leader",
    resolutionNote:
      "Compactor truck cleared 4.2 tons of waste overflow; alley power-washed and sanitized with lime powder.",
    date: "Completed 2 Days Ago",
    beforeImage: "/images/civic/sanitation-before.jpg",
    afterImage: "/images/civic/sanitation-after.jpg",
    beforeAlt: "Overflowing dumpster with litter on pavement",
    afterAlt: "Clean emptied dumpster and power-washed alleyway",
  },
];

export function RecentResolvedShowcase() {
  // Track active view ("after" by default to showcase resolved state)
  const [activeView, setActiveView] = useState<Record<string, "before" | "after">>({
    "REQ-2026-0891": "after",
    "REQ-2026-0884": "after",
    "REQ-2026-0873": "after",
  });

  const toggleView = (caseNo: string, view: "before" | "after") => {
    setActiveView((prev) => ({ ...prev, [caseNo]: view }));
  };

  return (
    <section className="relative border-b bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Verified Public Proof
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Recently Resolved in Your City
            </h2>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">
              Every resolved ticket is sealed with timestamped before & after
              photographic proof, field notes, and transparent turnaround SLA metrics.
            </p>
          </div>
          <Link href="/track">
            <Button variant="outline" size="default" className="gap-2 font-medium">
              Audit Any Ticket ID
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* 3 Interactive Photographic Proof Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {RECENT_RESOLVED_CASES.map((item) => {
            const currentView = activeView[item.requestNo] ?? "after";
            const isShowingAfter = currentView === "after";

            return (
              <Card
                key={item.requestNo}
                className="group flex flex-col justify-between overflow-hidden border border-slate-200/90 bg-card shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
              >
                {/* Photo Viewer Container with Interactive Toggle */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={isShowingAfter ? item.afterImage : item.beforeImage}
                    alt={isShowingAfter ? item.afterAlt : item.beforeAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-opacity duration-300"
                  />

                  {/* Dark vignette gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                  {/* Status Badge on Top Left */}
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                    {isShowingAfter ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                        <Sparkles className="size-3" />
                        AFTER (RESOLVED)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-600/90 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                        <Eye className="size-3" />
                        BEFORE (REPORTED)
                      </span>
                    )}
                  </div>

                  {/* Turnaround Badge on Top Right */}
                  <div className="absolute right-3 top-3 z-10">
                    <span className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400 backdrop-blur-sm border border-emerald-500/30">
                      <Clock className="size-3" />
                      {item.turnaround}
                    </span>
                  </div>

                  {/* Interactive Before/After Toggle Controls at Bottom */}
                  <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between">
                    <div className="flex rounded-lg border border-white/20 bg-slate-950/80 p-0.5 shadow-md backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => toggleView(item.requestNo, "before")}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                          !isShowingAfter
                            ? "bg-amber-500 text-white"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Before
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleView(item.requestNo, "after")}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                          isShowingAfter
                            ? "bg-emerald-500 text-white"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        After
                      </button>
                    </div>

                    <span className="font-mono text-[11px] font-medium text-slate-300">
                      {item.slaTarget}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {item.requestNo}
                    </span>
                    <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4">
                      VERIFIED REPAIR
                    </Badge>
                  </div>
                  <CardTitle className="mt-1 line-clamp-1 text-base font-bold text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pb-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="flex items-center gap-1.5 truncate">
                      <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{item.department}</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium text-foreground shrink-0">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      {item.ward}
                    </span>
                  </div>

                  {/* Technician Note */}
                  <div className="rounded-lg border bg-muted/40 p-2.5 text-xs text-foreground">
                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground mb-1">
                      <UserCheck className="size-3 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">
                        {item.technician}
                      </span>
                      <span className="text-[10px]">({item.technicianRole})</span>
                    </div>
                    <p className="line-clamp-2 text-muted-foreground leading-relaxed">
                      "{item.resolutionNote}"
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="size-3" />
                    {item.date}
                  </span>
                  <Link
                    href={`/track?trackingId=${item.requestNo}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Audit Details →
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
