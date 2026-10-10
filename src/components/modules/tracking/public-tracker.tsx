"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StepRecord {
  title: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  iconType: "check" | "wrench" | "user" | "building" | "doc";
  statusColor: "emerald" | "blue";
}

interface TrackingRecord {
  requestNo: string;
  title: string;
  description: string;
  category: string;
  department: string;
  ward: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "SUBMITTED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  reportedOn: string;
  slaTarget: string;
  slaRemaining: string;
  assignedOfficer: string;
  assignedTechnician: string;
  locationDetails: string;
  beforePhoto: string;
  afterPhoto: string;
  steps: StepRecord[];
  timeline: TimelineEvent[];
}

const SAMPLE_TRACKING_DATA: Record<string, TrackingRecord> = {
  "REQ-2026-0891": {
    requestNo: "REQ-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    description:
      "Deep potholes, surface cracks, missing manhole covers, and hazardous asphalt craters on public roadways.",
    category: "Road Pothole & Asphalt Damage",
    department: "Public Works & Road Maintenance",
    ward: "Ward 12, Mirpur",
    priority: "HIGH",
    status: "RESOLVED",
    reportedOn: "Jan 15, 2026, 10:24 AM",
    slaTarget: "Target SLA: 48 hrs",
    slaRemaining: "Resolved in 24 hrs",
    assignedOfficer: "Md. Alamgir Hossain (Case Officer)",
    assignedTechnician: "Suman Mia (Field Lead)",
    locationDetails: "Mirpur-10 Main Intersection Westbound Lane",
    beforePhoto: "/images/civic/pothole-before.jpg",
    afterPhoto: "/images/civic/pothole-after.jpg",
    steps: [
      {
        title: "Received",
        timestamp: "Jan 15, 09:30 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        timestamp: "Jan 15, 11:15 AM",
        completed: true,
      },
      {
        title: "In Progress",
        timestamp: "Jan 15, 03:45 PM",
        completed: true,
      },
      {
        title: "Resolved",
        timestamp: "Jan 16, 09:30 AM",
        completed: true,
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Resolution Verified",
        description: "Final inspection completed and photo verified.",
        timestamp: "Jan 16, 09:30 AM",
        iconType: "check",
        statusColor: "emerald",
      },
      {
        id: "t2",
        title: "Repair Work Completed",
        description: "Asphalt patch poured, steam-roller compacted, lane reopened.",
        timestamp: "Jan 15, 03:45 PM",
        iconType: "wrench",
        statusColor: "blue",
      },
      {
        id: "t3",
        title: "Technician Dispatched",
        description: "Field crew arrived with asphalt compaction equipment.",
        timestamp: "Jan 15, 11:15 AM",
        iconType: "user",
        statusColor: "blue",
      },
      {
        id: "t4",
        title: "Department Routed",
        description: "Dispatched to Public Works department. SLA activated.",
        timestamp: "Jan 15, 10:45 AM",
        iconType: "building",
        statusColor: "blue",
      },
      {
        id: "t5",
        title: "Complaint Received",
        description: "Logged via citizen portal with 2 geo-tagged photos.",
        timestamp: "Jan 15, 09:30 AM",
        iconType: "doc",
        statusColor: "blue",
      },
    ],
  },
  "REQ-2026-0922": {
    requestNo: "REQ-2026-0922",
    title: "Broken Streetlight on Gulshan Avenue Road 36",
    description:
      "A 300-meter corridor of municipal luminaires completely dark due to burnt line transformer fuse, creating hazard.",
    category: "Streetlight Outage & Damaged Lamp",
    department: "Electrical & Street Lighting",
    ward: "Ward 08, Gulshan",
    priority: "HIGH",
    status: "IN_PROGRESS",
    reportedOn: "Jan 16, 2026, 07:15 PM",
    slaTarget: "Target SLA: 24 hrs",
    slaRemaining: "11h 45m SLA remaining",
    assignedOfficer: "Tanvir Ahmed (Zone Engineer)",
    assignedTechnician: "Kabir Hossain (Linesman)",
    locationDetails: "Gulshan Avenue, Road 36, Poles 12 to 24",
    beforePhoto: "/images/civic/streetlight-before.jpg",
    afterPhoto: "/images/civic/streetlight-after.jpg",
    steps: [
      {
        title: "Received",
        timestamp: "Jan 16, 07:15 PM",
        completed: true,
      },
      {
        title: "Department Routed",
        timestamp: "Jan 16, 08:30 PM",
        completed: true,
      },
      {
        title: "In Progress",
        timestamp: "Jan 17, 09:00 AM",
        completed: true,
        active: true,
      },
      {
        title: "Resolved",
        timestamp: "Pending Verification",
        completed: false,
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Technician On-Site",
        description: "Hydraulic bucket lift isolated line; replacing 400A transformer capacitor.",
        timestamp: "Jan 17, 09:00 AM",
        iconType: "wrench",
        statusColor: "blue",
      },
      {
        id: "t2",
        title: "Department Routed",
        description: "Dispatched to Electrical & Street Lighting division. High priority flag set.",
        timestamp: "Jan 16, 08:30 PM",
        iconType: "building",
        statusColor: "blue",
      },
      {
        id: "t3",
        title: "Complaint Received",
        description: "Logged via citizen mobile app with pole tags #36-B1 to #36-B8.",
        timestamp: "Jan 16, 07:15 PM",
        iconType: "doc",
        statusColor: "blue",
      },
    ],
  },
  "REQ-2026-0915": {
    requestNo: "REQ-2026-0915",
    title: "Illegal Solid Waste Dumping Near Dhanmondi Lake",
    description:
      "Municipal dumpster container over-capacity, spilled 3 tons onto sidewalk and bicycle pathway causing sanitation block.",
    category: "Waste Management & Sanitation",
    department: "Solid Waste Management",
    ward: "Ward 15, Dhanmondi",
    priority: "MEDIUM",
    status: "RESOLVED",
    reportedOn: "Jan 16, 2026, 08:00 AM",
    slaTarget: "Target SLA: 24 hrs",
    slaRemaining: "Resolved in 18 hrs",
    assignedOfficer: "Nasreen Sultana (Inspector)",
    assignedTechnician: "Rafiqul Islam (Sanitation Lead)",
    locationDetails: "Dhanmondi Lake Road 7, Sector 3 Corner",
    beforePhoto: "/images/civic/sanitation-before.jpg",
    afterPhoto: "/images/civic/sanitation-after.jpg",
    steps: [
      {
        title: "Received",
        timestamp: "Jan 16, 08:00 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        timestamp: "Jan 16, 09:15 AM",
        completed: true,
      },
      {
        title: "In Progress",
        timestamp: "Jan 16, 01:30 PM",
        completed: true,
      },
      {
        title: "Resolved",
        timestamp: "Jan 17, 02:00 AM",
        completed: true,
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Sanitation Audit Verified",
        description: "Dumpster emptied, perimeter swept and disinfected with bleach spray.",
        timestamp: "Jan 17, 02:00 AM",
        iconType: "check",
        statusColor: "emerald",
      },
      {
        id: "t2",
        title: "Compactor Hauling Completed",
        description: "Compactor truck #18 completed 3.4 tons waste pickup and transfer.",
        timestamp: "Jan 16, 04:00 PM",
        iconType: "wrench",
        statusColor: "blue",
      },
      {
        id: "t3",
        title: "Technician Dispatched",
        description: "Sanitation Squad Leader Rafiqul Islam assigned with hydraulic compactor.",
        timestamp: "Jan 16, 01:30 PM",
        iconType: "user",
        statusColor: "blue",
      },
      {
        id: "t4",
        title: "Department Routed",
        description: "Auto-routed to Zone 3 Solid Waste Division.",
        timestamp: "Jan 16, 09:15 AM",
        iconType: "building",
        statusColor: "blue",
      },
      {
        id: "t5",
        title: "Complaint Received",
        description: "Logged with geo-tagged photographic evidence.",
        timestamp: "Jan 16, 08:00 AM",
        iconType: "doc",
        statusColor: "blue",
      },
    ],
  },
  "REQ-2026-0890": {
    requestNo: "REQ-2026-0890",
    title: "Clogged Storm Drain Flooding Kazipara Alleyway",
    description:
      "Deep silt and plastic debris obstruction causing knee-deep water accumulation during rain, preventing pedestrian access.",
    category: "Drainage & Sewerage Overflow",
    department: "Drainage & Water Supply (WASA)",
    ward: "Ward 14, Mirpur",
    priority: "URGENT",
    status: "RESOLVED",
    reportedOn: "Jan 14, 2026, 02:40 PM",
    slaTarget: "Target SLA: 36 hrs",
    slaRemaining: "Resolved in 28 hrs",
    assignedOfficer: "Farhana Yasmin (Case Officer)",
    assignedTechnician: "Kamal Uddin (Hydraulic Lead)",
    locationDetails: "Kazipara Central Road, Near Block D Masjid",
    beforePhoto: "/images/civic/pothole-before.jpg",
    afterPhoto: "/images/civic/pothole-after.jpg",
    steps: [
      {
        title: "Received",
        timestamp: "Jan 14, 02:40 PM",
        completed: true,
      },
      {
        title: "Department Routed",
        timestamp: "Jan 14, 03:30 PM",
        completed: true,
      },
      {
        title: "In Progress",
        timestamp: "Jan 14, 06:15 PM",
        completed: true,
      },
      {
        title: "Resolved",
        timestamp: "Jan 15, 06:40 PM",
        completed: true,
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Drain Flow Verified",
        description: "High-pressure jet flushed culvert; stormwater drained completely.",
        timestamp: "Jan 15, 06:40 PM",
        iconType: "check",
        statusColor: "emerald",
      },
      {
        id: "t2",
        title: "Debris Sludge Removed",
        description: "Vacuum suction machine extracted 2 tons of sediment and plastic blockage.",
        timestamp: "Jan 15, 11:30 AM",
        iconType: "wrench",
        statusColor: "blue",
      },
      {
        id: "t3",
        title: "Emergency Crew Deployed",
        description: "Hydraulic pump vehicle dispatched to relieve waterlogging.",
        timestamp: "Jan 14, 06:15 PM",
        iconType: "user",
        statusColor: "blue",
      },
      {
        id: "t4",
        title: "Department Routed",
        description: "Flagged as URGENT stormwater issue in WASA emergency grid.",
        timestamp: "Jan 14, 03:30 PM",
        iconType: "building",
        statusColor: "blue",
      },
      {
        id: "t5",
        title: "Complaint Received",
        description: "Logged via citizen portal with flood level measurements.",
        timestamp: "Jan 14, 02:40 PM",
        iconType: "doc",
        statusColor: "blue",
      },
    ],
  },
};

const SAMPLE_IDS = [
  "REQ-2026-0891",
  "REQ-2026-0922",
  "REQ-2026-0915",
  "REQ-2026-0890",
];

export function PublicTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIdFromUrl = searchParams.get("trackingId");

  const [inputVal, setInputVal] = useState("REQ-2026-0891");
  const [activeId, setActiveId] = useState("REQ-2026-0891");

  useEffect(() => {
    if (initialIdFromUrl) {
      const normalized = initialIdFromUrl
        .trim()
        .toUpperCase()
        .replace(/^CCR-/, "REQ-");
      setInputVal(normalized);
      setActiveId(normalized);
    }
  }, [initialIdFromUrl]);

  const lookupKey = activeId.trim().toUpperCase().replace(/^CCR-/, "REQ-");
  const activeRecord =
    SAMPLE_TRACKING_DATA[lookupKey] || SAMPLE_TRACKING_DATA["REQ-2026-0891"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().toUpperCase().replace(/^CCR-/, "REQ-");
    setActiveId(clean);
    router.replace(`/track?trackingId=${encodeURIComponent(clean)}`);
  };

  const handleSelectSample = (id: string) => {
    setInputVal(id);
    setActiveId(id);
    router.replace(`/track?trackingId=${encodeURIComponent(id)}`);
  };

  return (
    <div className="w-full pb-16">
      {/* 1. TOP HEADER & SEARCH HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border/40 bg-background py-8 md:py-12 lg:py-14">
        {/* Right Background City Skyline Asset with Edge Fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full max-w-2xl overflow-hidden opacity-90 sm:opacity-100">
          {/* Light Mode Skyline */}
          <div className="block dark:hidden relative size-full">
            <Image
              src="/images/civic/track-hdr-light.png"
              alt="CityCare Municipal Cityscape (Light Mode)"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-right"
            />
          </div>
          {/* Dark Mode Skyline */}
          <div className="hidden dark:block relative size-full">
            <Image
              src="/images/civic/track-hdr-dark.png"
              alt="CityCare Municipal Cityscape (Dark Mode)"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-right"
            />
          </div>
          {/* Smooth Fade Overlays for seamless blending */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-36 sm:w-64 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3 py-0.5 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
              <Search className="size-3 text-sky-600 dark:text-sky-400" />
              <span>Track Your Complaint</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[42px] leading-tight">
              Track{" "}
              <span className="text-[#0284c7] dark:text-[#38bdf8]">
                Your Complaint
              </span>{" "}
              Status
            </h1>

            {/* Subparagraph */}
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Enter your unique complaint tracking number (e.g., REQ-2026-XXXX) to
              view real-time department routing, technician work updates, and
              SLA countdowns.
            </p>

            {/* Search Bar Form */}
            <form
              onSubmit={handleSearch}
              className="flex max-w-xl items-center rounded-xl border border-slate-200/90 bg-card p-1 shadow-sm transition-all dark:border-slate-800 dark:bg-[#0c1427]"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="REQ-2026-0891"
                  className="h-10 sm:h-11 w-full bg-transparent pl-10 pr-3 font-mono text-xs sm:text-sm uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                size="default"
                className="h-9 sm:h-10 gap-1.5 rounded-lg bg-[#0284c7] px-4 sm:px-6 font-semibold text-white shadow-sm hover:bg-[#0369a1] dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
              >
                <span>Track Status</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>

            {/* Sample IDs Quick Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Sample IDs:</span>
              {SAMPLE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectSample(id)}
                  className={`rounded-md border px-2.5 py-1 font-mono transition-colors ${
                    activeId === id
                      ? "border-[#0284c7] bg-sky-50 font-bold text-[#0284c7] dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:border-slate-400 hover:text-foreground dark:bg-slate-900/50"
                  }`}
                >
                  [{id}]
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN TRACKING DASHBOARD CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* 2. COMPLAINT SUMMARY CARD (MATCHES MOCKUP EXACTLY) */}
        <div className="rounded-2xl border border-slate-200/90 bg-card p-6 sm:p-8 shadow-sm transition-all dark:border-slate-800/80 dark:bg-[#0c1427]">
          {/* Card Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: ID & Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-base font-bold text-[#0284c7] dark:text-[#38bdf8] sm:text-lg">
                {activeRecord.requestNo}
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
                  activeRecord.status === "RESOLVED"
                    ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "border border-sky-500/30 bg-sky-500/15 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                }`}
              >
                {activeRecord.status.replace("_", " ")}
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
                  activeRecord.priority === "URGENT"
                    ? "border border-rose-500/30 bg-rose-500/15 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                    : "border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                }`}
              >
                {activeRecord.priority} PRIORITY
              </span>
            </div>

            {/* Right: SLA Countdown / Resolved Pill */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <Clock className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">{activeRecord.slaRemaining}</span>
                <span className="ml-2 text-[11px] text-muted-foreground font-normal">
                  {activeRecord.slaTarget}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mt-4 space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {activeRecord.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-4xl">
              {activeRecord.description}
            </p>
          </div>

          {/* 4 Metadata Columns (Department, Location, Reported On, Assigned Technician) */}
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-5 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-2.5">
              <Building2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground font-medium">Department</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {activeRecord.department}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground font-medium">Location</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {activeRecord.ward}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground font-medium">Reported On</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {activeRecord.reportedOn}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground font-medium">
                  Assigned Technician
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {activeRecord.assignedTechnician}
                </p>
              </div>
            </div>
          </div>

          {/* Continuous Horizontal Stepper (Node 1 -> Node 2 -> Node 3 -> Node 4) */}
          <div className="mt-8 border-t border-border/60 pt-6">
            <div className="relative">
              {/* Stepper Connecting Line */}
              <div className="absolute top-4 left-6 right-6 hidden sm:block -translate-y-1/2">
                <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-800" />
                {/* Active progress segment */}
                <div
                  className="absolute top-0 left-0 h-0.5 transition-all duration-500 bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-emerald-500"
                  style={{
                    width:
                      activeRecord.status === "RESOLVED"
                        ? "100%"
                        : activeRecord.status === "IN_PROGRESS"
                        ? "66%"
                        : "33%",
                  }}
                />
              </div>

              {/* 4 Stepper Nodes */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-0">
                {activeRecord.steps.map((step, idx) => {
                  const isResolvedNode = idx === 3;
                  const isCompleted = step.completed;
                  return (
                    <div
                      key={step.title}
                      className="relative flex flex-col items-start sm:items-center text-left sm:text-center"
                    >
                      {/* Circle Icon */}
                      <div
                        className={`relative z-10 flex size-8 items-center justify-center rounded-full transition-all ${
                          isCompleted
                            ? isResolvedNode
                              ? "bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-500/20"
                              : "bg-[#0284c7] text-white shadow-sm ring-4 ring-[#0284c7]/20"
                            : "border-2 border-slate-300 bg-card text-muted-foreground dark:border-slate-700"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="size-4 stroke-[3]" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className="mt-2.5 space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          {step.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {step.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWO-COLUMN LAYOUT: Activity Timeline & (Issue Location + Before/After) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (lg:col-span-7): Activity Timeline */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            {/* Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-border/60">
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8]">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Activity Timeline
                </h3>
                <p className="text-xs text-muted-foreground">
                  Real-time updates from department routing to final resolution.
                </p>
              </div>
            </div>

            {/* Vertical Chronological Timeline */}
            <div className="relative mt-6 space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activeRecord.timeline.map((item) => (
                <div key={item.id} className="relative flex items-start gap-4">
                  {/* Timeline Node Icon */}
                  <div
                    className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-background ${
                      item.statusColor === "emerald"
                        ? "bg-emerald-500"
                        : "bg-[#0284c7]"
                    }`}
                  >
                    {item.iconType === "check" && (
                      <Check className="size-4 stroke-[2.5]" />
                    )}
                    {item.iconType === "wrench" && (
                      <Wrench className="size-4 stroke-[2]" />
                    )}
                    {item.iconType === "user" && (
                      <UserCheck className="size-4 stroke-[2]" />
                    )}
                    {item.iconType === "building" && (
                      <Building2 className="size-4 stroke-[2]" />
                    )}
                    {item.iconType === "doc" && (
                      <FileText className="size-4 stroke-[2]" />
                    )}
                  </div>

                  {/* Content & Right Timestamp */}
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {item.title}
                      </h4>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Two Stacked Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Issue Location GIS Map */}
            <div className="rounded-2xl border border-slate-200/90 bg-card p-5 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              {/* Header */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#0284c7] dark:text-[#38bdf8]" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Issue Location
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activeRecord.ward}
                    </p>
                  </div>
                </div>

                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg border-sky-300 bg-sky-50/60 px-3 text-xs font-semibold text-[#0284c7] hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
                  >
                    <span>View on Map</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              {/* GIS Map Image from Mockups */}
              <div className="relative mt-3 w-full aspect-[16/7] overflow-hidden rounded-xl border border-border/80">
                {/* Light Mode GIS Map */}
                <div className="block dark:hidden relative size-full">
                  <Image
                    src="/images/civic/track-map-light.png"
                    alt="Issue Location GIS Map (Light Mode)"
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover object-center"
                  />
                </div>
                {/* Dark Mode GIS Map */}
                <div className="hidden dark:block relative size-full">
                  <Image
                    src="/images/civic/track-map-dark.png"
                    alt="Issue Location GIS Map (Dark Mode)"
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Before & After Photo Proof */}
            <div className="rounded-2xl border border-slate-200/90 bg-card p-5 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4">
                <div className="flex size-7 items-center justify-center rounded-lg bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8]">
                  <Camera className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Before & After
                </h3>
              </div>

              {/* Two Side-by-Side Photo Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Before Photo */}
                <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70 bg-muted/40">
                  <Image
                    src={activeRecord.beforePhoto}
                    alt={`${activeRecord.title} Before Repair`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 250px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Badge */}
                  <span className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-sm">
                    Before
                  </span>
                </div>

                {/* After Photo */}
                <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70 bg-muted/40">
                  <Image
                    src={activeRecord.afterPhoto}
                    alt={`${activeRecord.title} After Resolution`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 250px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Badge */}
                  <span className="absolute left-2 top-2 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-sm">
                    After
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
