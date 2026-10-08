"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Search,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackingRecord {
  requestNo: string;
  title: string;
  category: string;
  department: string;
  ward: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "SUBMITTED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  submittedAt: string;
  slaTarget: string;
  assignedOfficer: string;
  assignedTechnician?: string;
  steps: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
  updates: {
    time: string;
    author: string;
    note: string;
  }[];
}

const SAMPLE_TRACKING_DATA: Record<string, TrackingRecord> = {
  "REQ-2026-0891": {
    requestNo: "REQ-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    category: "Road Pothole & Asphalt Damage",
    department: "Public Works & Road Maintenance",
    ward: "Ward 12 (Mirpur)",
    priority: "HIGH",
    status: "RESOLVED",
    submittedAt: "Yesterday at 09:30 AM",
    slaTarget: "Target SLA: 48 hrs (Resolved in 24 hrs)",
    assignedOfficer: "Md. Alamgir Hossain (Case Officer)",
    assignedTechnician: "Suman Mia (Field Lead)",
    steps: [
      {
        title: "Complaint Received",
        description: "Logged via citizen portal with 2 geo-tagged photos.",
        timestamp: "Yesterday 09:30 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        description:
          "Dispatched to Public Works Dept; SLA countdown activated.",
        timestamp: "Yesterday 11:15 AM",
        completed: true,
      },
      {
        title: "Technician Dispatched",
        description: "Field crew arrived with asphalt compaction equipment.",
        timestamp: "Yesterday 03:45 PM",
        completed: true,
      },
      {
        title: "Resolved & Verified",
        description: "Pothole filled and steam-rolled; final photo uploaded.",
        timestamp: "Today 09:30 AM",
        completed: true,
        current: true,
      },
    ],
    updates: [
      {
        time: "Today 09:30 AM",
        author: "Suman Mia (Technician)",
        note: "Asphalt patch poured, steam-roller compacted, and lane reopened. Photo attached to record.",
      },
      {
        time: "Yesterday 03:45 PM",
        author: "Md. Alamgir Hossain (Officer)",
        note: "Crew 4 dispatched with asphalt mix truck #12.",
      },
      {
        time: "Yesterday 11:15 AM",
        author: "System SLA Dispatcher",
        note: "Automated routing verified ward boundaries. Category priority set to HIGH.",
      },
    ],
  },
  "REQ-2026-0902": {
    requestNo: "REQ-2026-0902",
    title: "Drinking Water Pipeline Burst on Lake Road",
    category: "Drinking Water Pipeline Leakage",
    department: "Water Supply & Sewerage Authority (WASA)",
    ward: "Ward 15 (Dhanmondi)",
    priority: "URGENT",
    status: "IN_PROGRESS",
    submittedAt: "Today at 07:15 AM",
    slaTarget: "Target SLA: 24 hrs (Remaining: 16 hrs)",
    assignedOfficer: "Farhana Yasmin (Emergency Case Officer)",
    assignedTechnician: "Kabir Hossain (WASA Crew Lead)",
    steps: [
      {
        title: "Complaint Received",
        description: "Emergency leak report logged by local residents.",
        timestamp: "Today 07:15 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        description: "Assigned to WASA Emergency Valve Unit.",
        timestamp: "Today 08:00 AM",
        completed: true,
      },
      {
        title: "Technician Dispatched",
        description: "Excavation and pipe replacement in active progress.",
        timestamp: "Today 09:30 AM",
        completed: true,
        current: true,
      },
      {
        title: "Resolution Verification",
        description: "Pressure testing and street repaving sign-off.",
        timestamp: "Pending completion",
        completed: false,
      },
    ],
    updates: [
      {
        time: "Today 09:30 AM",
        author: "Kabir Hossain (WASA)",
        note: "Main valve temporarily isolated. Replacement 4-inch PVC pipe section on site.",
      },
      {
        time: "Today 08:00 AM",
        author: "Farhana Yasmin (Officer)",
        note: "Severity elevated to URGENT due to water pressure loss in blocks 4 to 7.",
      },
    ],
  },
  "REQ-2026-0915": {
    requestNo: "REQ-2026-0915",
    title: "Streetlight Strip Dark on Main Boulevard",
    category: "Streetlight Outage & Damaged Lamp",
    department: "Electrical & Street Lighting",
    ward: "Ward 08 (Gulshan)",
    priority: "MEDIUM",
    status: "ASSIGNED",
    submittedAt: "Today at 11:20 AM",
    slaTarget: "Target SLA: 24 hrs (Remaining: 21 hrs)",
    assignedOfficer: "Tanvir Ahmed (Zone Electrical Engineer)",
    steps: [
      {
        title: "Complaint Received",
        description: "Reported with pole coordinates and ward ID.",
        timestamp: "Today 11:20 AM",
        completed: true,
      },
      {
        title: "Department Routed",
        description: "Assigned to Electrical Dept Zone 2 maintenance queue.",
        timestamp: "Today 12:05 PM",
        completed: true,
        current: true,
      },
      {
        title: "Technician Dispatched",
        description: "Hydraulic cherry-picker truck scheduled for shift 2.",
        timestamp: "Scheduled for 04:00 PM",
        completed: false,
      },
      {
        title: "Resolution Verification",
        description: "Luminance test and photo verification.",
        timestamp: "Pending",
        completed: false,
      },
    ],
    updates: [
      {
        time: "Today 12:05 PM",
        author: "Tanvir Ahmed (Engineer)",
        note: "Feeder breaker suspected. Maintenance truck scheduled for afternoon cycle.",
      },
    ],
  },
};

export function PublicTracker() {
  const [query, setQuery] = useState("REQ-2026-0891");
  const [searchedId, setSearchedId] = useState("REQ-2026-0891");

  const activeRecord = SAMPLE_TRACKING_DATA[searchedId.toUpperCase().trim()];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(query.trim());
  };

  const handleQuickSelect = (id: string) => {
    setQuery(id);
    setSearchedId(id);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <Card className="border bg-card">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Complaint Number (e.g. REQ-2026-0891)"
                className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm uppercase text-foreground outline-none placeholder:normal-case placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button type="submit" size="lg" className="gap-2 sm:w-auto">
              <Search className="size-4" />
              Track Status
            </Button>
          </form>

          {/* Quick Select Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Sample Test IDs:
            </span>
            <button
              type="button"
              onClick={() => handleQuickSelect("REQ-2026-0891")}
              className="rounded border bg-muted/60 px-2 py-1 font-mono transition-colors hover:bg-muted hover:text-foreground"
            >
              REQ-2026-0891 (Resolved)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect("REQ-2026-0902")}
              className="rounded border bg-muted/60 px-2 py-1 font-mono transition-colors hover:bg-muted hover:text-foreground"
            >
              REQ-2026-0902 (In Progress)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect("REQ-2026-0915")}
              className="rounded border bg-muted/60 px-2 py-1 font-mono transition-colors hover:bg-muted hover:text-foreground"
            >
              REQ-2026-0915 (Assigned)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Record Result */}
      {activeRecord ? (
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="border bg-card">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary">
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
                    >
                      {activeRecord.priority} PRIORITY
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {activeRecord.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span>{activeRecord.slaTarget}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 border-t pt-4 text-xs sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-muted-foreground">
                    Responsible Department
                  </p>
                  <p className="font-medium text-foreground">
                    {activeRecord.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-muted-foreground">Jurisdiction / Ward</p>
                  <p className="font-medium text-foreground">
                    {activeRecord.ward}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-muted-foreground">Assigned Officers</p>
                  <p className="font-medium text-foreground">
                    {activeRecord.assignedTechnician ??
                      activeRecord.assignedOfficer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stepper Progress */}
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Municipal Resolution Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                {activeRecord.steps.map((step, idx) => (
                  <div
                    key={step.title}
                    className={`relative flex flex-col rounded-md border p-4 ${
                      step.completed
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        Step 0{idx + 1}
                      </span>
                      {step.completed ? (
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Clock className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-foreground">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <span className="mt-3 text-[11px] font-medium text-muted-foreground">
                      {step.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verified Field Work Log */}
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                On-Site Inspection & Activity Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeRecord.updates.map((update) => (
                <div
                  key={update.time}
                  className="rounded-md border bg-muted/40 p-3.5 text-xs text-foreground space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">
                      {update.author}
                    </span>
                    <span className="text-muted-foreground">{update.time}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {update.note}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border border-dashed bg-card py-12 text-center">
          <CardContent className="flex flex-col items-center">
            <AlertCircle className="size-10 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No Request Found for "{searchedId}"
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Please verify your request reference number format (e.g.
              REQ-2026-XXXX) or click one of the sample test buttons above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
