"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ClockAlert,
  HardHat,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ServiceRequest } from "@/types";

interface StaffMetricsProps {
  requests: ServiceRequest[];
  isLoading?: boolean;
}

export function StaffMetrics({ requests, isLoading = false }: StaffMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const now = Date.now();

  const totalAssigned = requests.length;

  const urgentCount = requests.filter(
    (r) =>
      (r.priority === "URGENT" || r.priority === "HIGH") &&
      r.status !== "RESOLVED" &&
      r.status !== "CLOSED" &&
      r.status !== "REJECTED",
  ).length;

  const inProgressCount = requests.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;

  const overdueCount = requests.filter((r) => {
    if (r.status === "RESOLVED" || r.status === "CLOSED" || r.status === "REJECTED") {
      return false;
    }
    if (!r.resolutionDueAt) return false;
    return new Date(r.resolutionDueAt).getTime() < now;
  }).length;

  const resolvedCount = requests.filter(
    (r) => r.status === "RESOLVED" || r.status === "CLOSED",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Assigned Workload */}
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-border/70">
        <div className="absolute top-0 inset-x-0 h-1 bg-primary/70" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Assigned Workload
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <HardHat className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold tracking-tight">
              {totalAssigned}
            </div>
            <Badge variant="outline" className="text-[11px] font-medium">
              Queue Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {resolvedCount > 0
              ? `${resolvedCount} resolved so far`
              : "Assigned to your department queue"}
          </p>
        </CardContent>
      </Card>

      {/* 2. Urgent / High Priority */}
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-border/70">
        <div
          className={`absolute top-0 inset-x-0 h-1 ${
            urgentCount > 0 ? "bg-amber-500" : "bg-muted"
          }`}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Urgent Priority Cases
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${
              urgentCount > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <AlertTriangle className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div
              className={`text-3xl font-extrabold tracking-tight ${
                urgentCount > 0 ? "text-amber-600 dark:text-amber-400" : ""
              }`}
            >
              {urgentCount}
            </div>
            {urgentCount > 0 ? (
              <Badge variant="warning" className="text-[11px] font-semibold animate-pulse">
                Needs Triage
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px]">
                Normal
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {urgentCount > 0
              ? "Critical tickets requiring immediate dispatch"
              : "No urgent backlog at this moment"}
          </p>
        </CardContent>
      </Card>

      {/* 3. Field Active / In Progress */}
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-border/70">
        <div className="absolute top-0 inset-x-0 h-1 bg-blue-500/80" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active / In Progress
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Wrench className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              {inProgressCount}
            </div>
            <Badge variant="info" className="text-[11px] font-medium">
              Field Work
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {inProgressCount > 0
              ? "On-site operations actively underway"
              : "No cases actively undergoing repair"}
          </p>
        </CardContent>
      </Card>

      {/* 4. SLA Overdue / At Risk */}
      <Card
        className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
          overdueCount > 0
            ? "border-destructive/60 bg-destructive/5"
            : "border-border/70"
        }`}
      >
        <div
          className={`absolute top-0 inset-x-0 h-1 ${
            overdueCount > 0 ? "bg-destructive" : "bg-emerald-500"
          }`}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            SLA Compliance
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${
              overdueCount > 0
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {overdueCount > 0 ? (
              <ClockAlert className="size-4" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div
              className={`text-3xl font-extrabold tracking-tight ${
                overdueCount > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {overdueCount > 0 ? overdueCount : "100%"}
            </div>
            {overdueCount > 0 ? (
              <Badge variant="destructive" className="text-[11px] font-bold">
                SLA Breached
              </Badge>
            ) : (
              <Badge variant="success" className="text-[11px] font-medium">
                Compliant
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {overdueCount > 0
              ? `${overdueCount} case(s) exceed resolution SLA target`
              : "All active tickets within guaranteed SLA"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
