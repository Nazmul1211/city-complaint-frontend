"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  MapPin,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepRecord {
  title: string;
  subtitle: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

interface UpdateRecord {
  time: string;
  author: string;
  role: string;
  note: string;
  type: "triage" | "dispatch" | "work" | "completion";
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
  submittedAt: string;
  slaTarget: string;
  slaRemaining: string;
  assignedOfficer: string;
  assignedTechnician: string;
  technicianPhone?: string;
  locationDetails: string;
  coordinates: string;
  beforePhoto?: string;
  afterPhoto?: string;
  steps: StepRecord[];
  updates: UpdateRecord[];
}

const SAMPLE_TRACKING_DATA: Record<string, TrackingRecord> = {
  "REQ-2026-0891": {
    requestNo: "REQ-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    description:
      "Large asphalt cavity (approx 1.2m diameter, 18cm depth) on the westbound lane right before the roundabout, causing severe vehicle slowdown and traffic hazard.",
    category: "Road Pothole & Asphalt Damage",
    department: "Public Works & Road Maintenance",
    ward: "Ward 12 (Mirpur Sector)",
    priority: "HIGH",
    status: "RESOLVED",
    submittedAt: "Oct 09, 2026 • 09:30 AM",
    slaTarget: "Legal SLA: 48 hrs",
    slaRemaining: "Resolved in 24 hrs (On-Time)",
    assignedOfficer: "Md. Alamgir Hossain (Case Officer)",
    assignedTechnician: "Md. Rahim Uddin (Lead Field Technician)",
    technicianPhone: "+880 1711-002233",
    locationDetails: "Mirpur-10 Roundabout Westbound Lane, Section 6",
    coordinates: "23.8069° N, 90.3687° E",
    beforePhoto: "/images/civic/pothole-before.jpg",
    afterPhoto: "/images/civic/pothole-after.jpg",
    steps: [
      {
        title: "Complaint Received",
        subtitle: "Citizen Intake",
        description: "Logged via citizen web portal with 2 geo-tagged photos and GPS pin.",
        timestamp: "Oct 09 • 09:30 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        subtitle: "Jurisdiction Triage",
        description: "Auto-dispatched to Public Works Dept; statutory 48h SLA activated.",
        timestamp: "Oct 09 • 11:15 AM",
        completed: true,
      },
      {
        title: "Technician Dispatched",
        subtitle: "Field Team On-Site",
        description: "Crew #4 dispatched with asphalt steam-roller unit and bitumen mix truck.",
        timestamp: "Oct 09 • 03:45 PM",
        completed: true,
      },
      {
        title: "Resolved & Verified",
        subtitle: "Citizen Sign-off",
        description: "Cavity steam-roller patched, white lane painted, photographic sign-off confirmed.",
        timestamp: "Oct 10 • 09:30 AM",
        completed: true,
        current: true,
      },
    ],
    updates: [
      {
        time: "Today • 09:30 AM",
        author: "Md. Rahim Uddin",
        role: "Lead Field Technician",
        note: "Asphalt patch poured, steam-roller compacted flush with road level, lane reopened. Photographic evidence recorded.",
        type: "completion",
      },
      {
        time: "Yesterday • 03:45 PM",
        author: "Md. Alamgir Hossain",
        role: "Case Officer",
        note: "Field maintenance order generated. Assigned to Crew 4 (Lead: Md. Rahim).",
        type: "dispatch",
      },
      {
        time: "Yesterday • 11:15 AM",
        author: "Automated SLA Dispatcher",
        role: "System Service",
        note: "Ward 12 boundary confirmed. Category priority classified as HIGH based on traffic volume density.",
        type: "triage",
      },
      {
        time: "Yesterday • 09:30 AM",
        author: "Citizen Portal",
        role: "Intake System",
        note: "New service request submitted with GPS coordinates.",
        type: "triage",
      },
    ],
  },
  "REQ-2026-0884": {
    requestNo: "REQ-2026-0884",
    title: "Faulty Transformer & Dark Streetlight Strip",
    description:
      "A 300-meter stretch of municipal streetlights unlit due to burnt substation transformer fuse near Gulshan Avenue Block B.",
    category: "Streetlight Outage & Damaged Lamp",
    department: "Electrical & Street Lighting",
    ward: "Ward 08 (Gulshan)",
    priority: "HIGH",
    status: "RESOLVED",
    submittedAt: "Oct 08, 2026 • 06:10 PM",
    slaTarget: "Legal SLA: 24 hrs",
    slaRemaining: "Resolved in 14 hrs (On-Time)",
    assignedOfficer: "Tanvir Ahmed (Zone Electrical Engineer)",
    assignedTechnician: "Kabir Hossain (High-Voltage Linesman)",
    technicianPhone: "+880 1812-334455",
    locationDetails: "Gulshan Avenue, Road 36, Poles 12 to 24",
    coordinates: "23.7925° N, 90.4078° E",
    beforePhoto: "/images/civic/streetlight-before.jpg",
    afterPhoto: "/images/civic/streetlight-after.jpg",
    steps: [
      {
        title: "Complaint Received",
        subtitle: "Citizen Intake",
        description: "Logged by local merchant association with pole number reference.",
        timestamp: "Oct 08 • 06:10 PM",
        completed: true,
      },
      {
        title: "Department Routed",
        subtitle: "Triage & Parts Order",
        description: "Zone 2 electrical dispatch center alerted; replacement 400A fuse reserved.",
        timestamp: "Oct 08 • 07:30 PM",
        completed: true,
      },
      {
        title: "Technician Dispatched",
        subtitle: "Night Shift Crew",
        description: "Hydraulic lift truck deployed to test feeder circuits 1 through 4.",
        timestamp: "Oct 08 • 10:45 PM",
        completed: true,
      },
      {
        title: "Resolved & Verified",
        subtitle: "Luminance Sign-off",
        description: "All 12 luminaires verified with 45 Lux average road brightness.",
        timestamp: "Oct 09 • 08:15 AM",
        completed: true,
        current: true,
      },
    ],
    updates: [
      {
        time: "Oct 09 • 08:15 AM",
        author: "Kabir Hossain",
        role: "High-Voltage Linesman",
        note: "Transformer capacitor bank replaced. Luminance readings normal across all 12 poles.",
        type: "completion",
      },
      {
        time: "Oct 08 • 10:45 PM",
        author: "Tanvir Ahmed",
        role: "Zone Electrical Engineer",
        note: "Substation isolated for safety. Replacement work underway.",
        type: "work",
      },
    ],
  },
  "REQ-2026-0873": {
    requestNo: "REQ-2026-0873",
    title: "Overflowing Garbage Dumpster on Road 7",
    description:
      "Municipal container completely packed with commercial waste and overflowing 2 meters onto the footpath and gutter.",
    category: "Solid Waste & Sanitation",
    department: "Solid Waste Management",
    ward: "Ward 19 (Banani)",
    priority: "MEDIUM",
    status: "RESOLVED",
    submittedAt: "Oct 07, 2026 • 11:00 AM",
    slaTarget: "Legal SLA: 12 hrs",
    slaRemaining: "Resolved in 8 hrs (On-Time)",
    assignedOfficer: "Nasreen Sultana (Sanitation Inspector)",
    assignedTechnician: "Suman Mia (Sanitation Squad Leader)",
    technicianPhone: "+880 1913-778899",
    locationDetails: "Road 7, Block F Corner Dumpster Station",
    coordinates: "23.7937° N, 90.4043° E",
    beforePhoto: "/images/civic/sanitation-before.jpg",
    afterPhoto: "/images/civic/sanitation-after.jpg",
    steps: [
      {
        title: "Complaint Received",
        subtitle: "Citizen Intake",
        description: "Logged with photo attachment via mobile app.",
        timestamp: "Oct 07 • 11:00 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        subtitle: "Shift Assignment",
        description: "Compactor vehicle #14 added stop to noon route.",
        timestamp: "Oct 07 • 11:45 AM",
        completed: true,
      },
      {
        title: "Technician Dispatched",
        subtitle: "Collection & Cleaning",
        description: "Heavy compactor emptied container and sweep squad deployed.",
        timestamp: "Oct 07 • 03:20 PM",
        completed: true,
      },
      {
        title: "Resolved & Verified",
        subtitle: "Sanitization Audit",
        description: "Sidewalk power-washed and disinfected with chlorine powder.",
        timestamp: "Oct 07 • 07:00 PM",
        completed: true,
        current: true,
      },
    ],
    updates: [
      {
        time: "Oct 07 • 07:00 PM",
        author: "Suman Mia",
        role: "Squad Leader",
        note: "Container emptied (4.2 tons waste removed). Sidewalk power-washed and disinfected.",
        type: "completion",
      },
    ],
  },
  "REQ-2026-0902": {
    requestNo: "REQ-2026-0902",
    title: "Drinking Water Pipeline Burst on Lake Road",
    description:
      "Underground WASA supply pipe fractured, water spraying onto roadway and reducing pressure for neighboring residential blocks.",
    category: "Drinking Water Pipeline Leakage",
    department: "Water Supply & Sewerage Authority (WASA)",
    ward: "Ward 15 (Dhanmondi)",
    priority: "URGENT",
    status: "IN_PROGRESS",
    submittedAt: "Today • 07:15 AM",
    slaTarget: "Legal SLA: 24 hrs",
    slaRemaining: "16h 45m Remaining",
    assignedOfficer: "Farhana Yasmin (Emergency Case Officer)",
    assignedTechnician: "Kabir Hossain (WASA Emergency Crew Lead)",
    technicianPhone: "+880 1614-556677",
    locationDetails: "Dhanmondi Lake Road, Opposite House 42",
    coordinates: "23.7461° N, 90.3742° E",
    steps: [
      {
        title: "Complaint Received",
        subtitle: "Emergency Intake",
        description: "Emergency leak report logged by local residents.",
        timestamp: "Today • 07:15 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        subtitle: "WASA Valve Unit",
        description: "Emergency valve squad dispatched to isolate damaged section.",
        timestamp: "Today • 08:00 AM",
        completed: true,
      },
      {
        title: "Technician Dispatched",
        subtitle: "Active Excavation",
        description: "Backhoe and welding crew excavating street to replace 4-inch PVC line.",
        timestamp: "Today • 09:30 AM",
        completed: true,
        current: true,
      },
      {
        title: "Resolution Verification",
        subtitle: "Pressure Restoration",
        description: "Pressure test sign-off and tarmac patch.",
        timestamp: "Estimated 06:00 PM",
        completed: false,
      },
    ],
    updates: [
      {
        time: "Today • 09:30 AM",
        author: "Kabir Hossain",
        role: "WASA Crew Lead",
        note: "Main feeder valve isolated. Excavation underway; replacement 4-inch PVC pipe section on site.",
        type: "work",
      },
      {
        time: "Today • 08:00 AM",
        author: "Farhana Yasmin",
        role: "Case Officer",
        note: "Severity elevated to URGENT due to water pressure loss in Dhanmondi blocks 4 to 7.",
        type: "triage",
      },
    ],
  },
};

export function PublicTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIdFromUrl = searchParams.get("trackingId");

  const [inputVal, setInputVal] = useState("REQ-2026-0891");
  const [activeId, setActiveId] = useState("REQ-2026-0891");
  const [copied, setCopied] = useState(false);
  const [photoTab, setPhotoTab] = useState<"after" | "before">("after");

  // Read URL query parameter on mount or url change
  useEffect(() => {
    if (initialIdFromUrl) {
      // Normalize CCR to REQ if user came from hero map
      const normalized = initialIdFromUrl
        .trim()
        .toUpperCase()
        .replace(/^CCR-/, "REQ-");
      setInputVal(normalized);
      setActiveId(normalized);
    }
  }, [initialIdFromUrl]);

  // Lookup record
  const lookupKey = activeId.trim().toUpperCase().replace(/^CCR-/, "REQ-");
  const activeRecord = SAMPLE_TRACKING_DATA[lookupKey];

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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Search Bar & Quick Sample Selection */}
      <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter complaint number (e.g. REQ-2026-0891)"
                className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 font-mono text-sm uppercase text-foreground shadow-sm placeholder:normal-case placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button type="submit" size="lg" className="gap-2 font-semibold sm:w-auto">
              <Search className="size-4" />
              Track Case
            </Button>
          </form>

          {/* Quick Sample Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Sample Case Studies:
            </span>
            <button
              type="button"
              onClick={() => handleSelectSample("REQ-2026-0891")}
              className={`rounded-md border px-2.5 py-1 font-mono transition-colors ${
                activeId === "REQ-2026-0891"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              }`}
            >
              REQ-2026-0891 (Pothole • Resolved)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample("REQ-2026-0884")}
              className={`rounded-md border px-2.5 py-1 font-mono transition-colors ${
                activeId === "REQ-2026-0884"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              }`}
            >
              REQ-2026-0884 (Streetlight • Resolved)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample("REQ-2026-0873")}
              className={`rounded-md border px-2.5 py-1 font-mono transition-colors ${
                activeId === "REQ-2026-0873"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              }`}
            >
              REQ-2026-0873 (Sanitation • Resolved)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample("REQ-2026-0902")}
              className={`rounded-md border px-2.5 py-1 font-mono transition-colors ${
                activeId === "REQ-2026-0902"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              }`}
            >
              REQ-2026-0902 (WASA Burst • In Progress)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Detailed Complaint Tracking Record */}
      {activeRecord ? (
        <div className="space-y-8">
          {/* Main Case Summary Card */}
          <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-primary">
                      {activeRecord.requestNo}
                    </span>
                    <Badge
                      variant={
                        activeRecord.status === "RESOLVED"
                          ? "success"
                          : activeRecord.status === "IN_PROGRESS"
                          ? "info"
                          : "secondary"
                      }
                      className="font-bold text-xs"
                    >
                      {activeRecord.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant={
                        activeRecord.priority === "URGENT"
                          ? "destructive"
                          : activeRecord.priority === "HIGH"
                          ? "warning"
                          : "outline"
                      }
                      className="font-bold text-xs"
                    >
                      {activeRecord.priority} PRIORITY
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-2xl font-bold text-foreground">
                    {activeRecord.title}
                  </CardTitle>
                </div>

                {/* SLA Benchmark Pill */}
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Clock className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="block font-bold">{activeRecord.slaRemaining}</span>
                    <span className="block text-[11px] text-muted-foreground font-normal">
                      {activeRecord.slaTarget}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {activeRecord.description}
              </p>
            </CardHeader>

            {/* 4 Metadata Columns Strip */}
            <CardContent className="grid grid-cols-1 gap-4 border-t pt-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-2.5">
                <Building2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground font-medium">Department</p>
                  <p className="font-semibold text-foreground">{activeRecord.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground font-medium">Ward Jurisdiction</p>
                  <p className="font-semibold text-foreground">{activeRecord.ward}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground font-medium">Reported At</p>
                  <p className="font-semibold text-foreground">{activeRecord.submittedAt}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <UserCheck className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground font-medium">Assigned Crew</p>
                  <p className="font-semibold text-foreground">
                    {activeRecord.assignedTechnician}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4-Stage Horizontal Stepper Progress */}
          <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Resolution Stepper & Official Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {activeRecord.steps.map((step, idx) => (
                  <div
                    key={step.title}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                      step.completed
                        ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                        : "border-border bg-muted/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          Stage 0{idx + 1}
                        </span>
                        {step.completed ? (
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-primary">
                        {step.subtitle}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-4 border-t pt-2 text-[11px] font-medium text-muted-foreground">
                      {step.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2-Column Operational Grid: Activity Trail (Left) + Proof & Telemetry (Right) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Chronological Audit Activity Log */}
            <div className="lg:col-span-7">
              <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    Chronological Field & Dispatch Audit Log
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Complete immutable log of all officer actions, system routing, and technician field notes.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeRecord.updates.map((update, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border bg-muted/40 p-4 text-xs transition-colors hover:bg-muted/60"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            {update.author}
                          </span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            {update.role}
                          </span>
                        </div>
                        <span className="font-mono text-muted-foreground text-[11px]">
                          {update.time}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        "{update.note}"
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Photo Proof & Ward Telemetry */}
            <div className="space-y-6 lg:col-span-5">
              {/* Photo Proof Card */}
              {activeRecord.afterPhoto || activeRecord.beforePhoto ? (
                <Card className="overflow-hidden border border-slate-200/90 bg-card shadow-sm dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="size-4 text-emerald-500" />
                        Verified Photographic Evidence
                      </CardTitle>
                      <div className="flex rounded-lg border bg-muted p-0.5">
                        <button
                          type="button"
                          onClick={() => setPhotoTab("after")}
                          className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
                            photoTab === "after"
                              ? "bg-emerald-600 text-white"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          After
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoTab("before")}
                          className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
                            photoTab === "before"
                              ? "bg-amber-600 text-white"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Before
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-950">
                      <Image
                        src={
                          photoTab === "after"
                            ? activeRecord.afterPhoto ?? activeRecord.beforePhoto!
                            : activeRecord.beforePhoto ?? activeRecord.afterPhoto!
                        }
                        alt="Municipal photographic evidence"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono font-medium text-white backdrop-blur-sm">
                        {photoTab === "after"
                          ? "COMPLETED WORK VERIFICATION"
                          : "ORIGINAL CITIZEN INTAKE PHOTO"}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {photoTab === "after"
                        ? "Photo uploaded by technician upon verified physical resolution."
                        : "Original condition photo submitted during initial complaint lodging."}
                    </p>
                  </CardContent>
                </Card>
              ) : null}

              {/* Ward Location & GPS Telemetry Card */}
              <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    Ward & GIS Telemetry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold text-foreground text-right">
                      {activeRecord.locationDetails}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">GPS Coordinates</span>
                    <span className="font-mono text-primary font-medium">
                      {activeRecord.coordinates}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Direct Desk</span>
                    <span className="font-mono text-foreground font-medium">
                      {activeRecord.technicianPhone ?? "333 (Civic Desk)"}
                    </span>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="pt-2 flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="w-full gap-2 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-emerald-500" /> Copied Link
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" /> Share Case Link
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="w-full gap-2 text-xs"
                    >
                      <Printer className="size-3.5" /> Print Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Civic Assistance Box */}
              <div className="rounded-xl border border-sky-200/80 bg-sky-50/50 p-4 text-xs dark:border-sky-950 dark:bg-sky-950/20">
                <p className="font-semibold text-foreground">
                  Need to dispute this resolution or file a followup?
                </p>
                <p className="mt-1 text-muted-foreground">
                  Citizens have a 72-hour window after ticket closure to reopen
                  a case if on-site repair is unsatisfactory.
                </p>
                <div className="mt-3">
                  <Link href="/dashboard/submit-request">
                    <Button size="sm" variant="default" className="w-full gap-2 text-xs font-semibold">
                      Lodge Related Follow-Up
                      <ExternalLink className="size-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border border-dashed bg-card py-16 text-center">
          <CardContent className="flex flex-col items-center">
            <AlertCircle className="size-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-bold text-foreground">
              No Record Found for "{activeId}"
            </h3>
            <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
              Please verify your complaint tracking number format (e.g.
              REQ-2026-0891) or select one of the sample case studies above to test
              real-time tracking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
