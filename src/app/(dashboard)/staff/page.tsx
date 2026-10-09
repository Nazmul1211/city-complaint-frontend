"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  HardHat,
  RefreshCw,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentAssignedList } from "@/components/modules/staff/recent-assigned-list";
import { StaffMetrics } from "@/components/modules/staff/staff-metrics";
import { useGetAllRequests, useGetMe } from "@/hooks";

export default function StaffOverviewPage() {
  const { data: meData } = useGetMe();
  const {
    data: requestsData,
    isLoading,
    refetch,
    isRefetching,
  } = useGetAllRequests({
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const user = meData?.data;
  const requests = requestsData?.data ?? [];

  const urgentCount = requests.filter(
    (r) =>
      (r.priority === "URGENT" || r.priority === "HIGH") &&
      r.status !== "RESOLVED" &&
      r.status !== "CLOSED",
  ).length;

  return (
    <div className="space-y-6">
      {/* Technician Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Staff Casework Overview
            </h1>
            <Badge
              variant="warning"
              className="gap-1 font-mono text-[11px] uppercase tracking-wide"
            >
              <HardHat className="size-3" />
              Field Technician
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back,{" "}
            <span className="font-medium text-foreground">
              {user?.name || "Technician"}
            </span>
            . Monitor department caseload, SLA deadlines, and onsite status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw
              className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh Queue
          </Button>

          <Link href="/staff/assigned">
            <Button size="sm" className="gap-1.5 text-xs h-9">
              <span>View All Assigned</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Urgent Alert Banner (if urgent tickets exist) */}
      {urgentCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">
                {urgentCount} Critical Priority Case{urgentCount > 1 ? "s" : ""}{" "}
                Awaiting Field Triage
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                Urgent complaints require initial status response or field inspection
                within SLA target.
              </p>
            </div>
          </div>
          <Link href="/staff/assigned?priority=URGENT">
            <Button
              size="sm"
              variant="outline"
              className="border-amber-600/40 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 text-xs shrink-0"
            >
              Triage Urgent Now
            </Button>
          </Link>
        </div>
      )}

      {/* Key Metrics Grid */}
      <StaffMetrics requests={requests} isLoading={isLoading} />

      {/* Main Split: Recent Casework + Field Protocols & Quick Triage */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Recent Assigned Queue */}
        <div className="lg:col-span-2 space-y-4">
          <RecentAssignedList requests={requests} isLoading={isLoading} />
        </div>

        {/* Right: Field Technician Operations Card */}
        <div className="space-y-4">
          {/* Dispatch Guidelines Card */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Field Operating Protocol
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  1
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Acknowledge Case
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Review assigned details and citizen notes before heading to location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  2
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Mark "In Progress" Onsite
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Transition ticket status when work commences to update citizen and stop SLA response timer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  3
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Attach Photo Verification
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Upload completion pictures or resolution log prior to marking "Resolved".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts Card */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">
                Quick Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              <Link
                href="/staff/assigned"
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HardHat className="size-3.5 text-muted-foreground" />
                  <span>Full Assigned Table</span>
                </div>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Link>

              <Link
                href="/staff/assigned?status=IN_PROGRESS"
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-blue-500" />
                  <span>Active In-Progress Cases</span>
                </div>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Camera className="size-3.5 text-muted-foreground" />
                  <span>Staff Profile & Photo</span>
                </div>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
