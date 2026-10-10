"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileQuestion,
  FileText,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
import { useGetMe, useGetMyRequests } from "@/hooks";
import type { ServiceRequest } from "@/types";

export default function CitizenOverviewPage() {
  const { data: meData } = useGetMe();
  const {
    data: requestsData,
    isLoading,
    refetch,
    isRefetching,
  } = useGetMyRequests({
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const user = meData?.data;
  const requests: ServiceRequest[] = useMemo(() => {
    return requestsData?.data || [];
  }, [requestsData]);

  const metrics = useMemo(() => {
    const total = requests.length;
    const active = requests.filter(
      (r) =>
        r.status !== "RESOLVED" &&
        r.status !== "CLOSED" &&
        r.status !== "REJECTED",
    ).length;
    const resolved = requests.filter(
      (r) => r.status === "RESOLVED" || r.status === "CLOSED",
    ).length;

    // Count unique wards citizen has submitted in
    const uniqueWards = new Set(
      requests.map(
        (r) =>
          r.reportedLocation?.ward?.id ||
          r.ward?.id ||
          r.wardId ||
          "ward-unknown",
      ),
    ).size;

    return {
      total,
      active,
      resolved,
      uniqueWards,
    };
  }, [requests]);

  const recentCases = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Citizen Civic Overview
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Welcome back{user?.name ? `, ${user.name}` : ""}. Monitor ongoing
            neighborhood casework, file new service petitions, and track
            verified repairs.
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
            Refresh
          </Button>

          <Link href="/dashboard/submit-request">
            <Button size="sm" className="gap-1.5 shadow-sm text-xs h-9">
              <Plus className="size-4" />
              Lodge Complaint
            </Button>
          </Link>

          <Link href="/track">
            <Button variant="outline" size="sm" className="text-xs h-9">
              Public Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border bg-card p-4 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-36" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Filed Cases
              </CardTitle>
              <FileText className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metrics.total}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.total > 0
                  ? `Across ${metrics.uniqueWards} municipal ward${metrics.uniqueWards > 1 ? "s" : ""}`
                  : "No filed complaints yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Active / In Progress
              </CardTitle>
              <Clock className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metrics.active}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.active > 0
                  ? "Field casework currently active"
                  : "All current cases resolved or closed"}
              </p>
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Verified Resolved
              </CardTitle>
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metrics.resolved}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.resolved > 0
                  ? "Inspected & sign-off complete"
                  : "No resolved cases yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Civic Standing
              </CardTitle>
              <ShieldCheck className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {user?.status === "ACTIVE"
                  ? "Verified"
                  : user?.status || "Active"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Citizen Account
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Filed Complaints Table */}
      <Card className="border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Filed Complaints
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Latest municipal complaints submitted from your account.
            </p>
          </div>
          {requests.length > 0 && (
            <Link href="/dashboard/requests">
              <Button
                variant="ghost"
                size="xs"
                className="gap-1 text-xs text-primary"
              >
                View All ({requests.length})
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          )}
        </CardHeader>

        <CardContent className="space-y-3 pt-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))}
            </div>
          ) : recentCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                <FileQuestion className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-sm">
                  No complaints filed yet
                </p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  You haven&apos;t lodged any civic petitions. Report road
                  craters, water supply leaks, waste overflow, or electrical
                  hazards to track repairs.
                </p>
              </div>
              <Link href="/dashboard/submit-request">
                <Button size="sm" className="gap-1.5 text-xs">
                  <Plus className="size-4" />
                  Lodge Your First Complaint
                </Button>
              </Link>
            </div>
          ) : (
            recentCases.map((item) => {
              const wardName =
                item.reportedLocation?.ward?.name ||
                item.ward?.name ||
                "Municipal Ward";
              const categoryName = item.category?.name || "Civic Complaint";
              const dateStr = new Date(item.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              );

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-md border p-3 text-xs sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">
                        {item.requestNo}
                      </span>
                      <PriorityBadge priority={item.priority} />
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="font-medium text-foreground line-clamp-1">
                      {item.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {categoryName} • {wardName} • Filed {dateStr}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/requests/${item.id}`}
                    className="shrink-0"
                  >
                    <Button variant="outline" size="xs">
                      View Timeline
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
