"use client";

import { ArrowRight, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { SlaCountdownBadge } from "@/components/modules/requests/sla-countdown-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
import type { ServiceRequest } from "@/types";

interface RecentAssignedListProps {
  requests: ServiceRequest[];
  isLoading?: boolean;
}

const SKELETON_ASSIGNED_KEYS = ["recent-1", "recent-2", "recent-3", "recent-4"];

export function RecentAssignedList({
  requests,
  isLoading = false,
}: RecentAssignedListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          {SKELETON_ASSIGNED_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const recentItems = requests.slice(0, 6);
  const isEmpty = recentItems.length === 0;

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">
            Recent Field Assignments
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-mono">
            {requests.length} Total
          </Badge>
        </div>
        <Link href="/staff/assigned">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs font-medium"
          >
            View All Queue
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
            <span className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </span>
            <p className="font-semibold text-foreground">
              Queue is currently clear
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              There are no pending or open complaints assigned to your
              department. New assignments routed by city admin will appear here
              in real-time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentItems.map((req) => {
              const wardName =
                req.reportedLocation?.ward?.name ||
                req.ward?.name ||
                "Municipal Ward";
              const categoryName = req.category?.name || "Civic Complaint";
              const dateStr = new Date(req.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {req.requestNo}
                      </span>
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={req.status} />
                      <SlaCountdownBadge
                        status={req.status}
                        resolutionDueAt={req.resolutionDueAt}
                        responseDueAt={req.responseDueAt}
                      />
                    </div>

                    <div>
                      <h4
                        className="text-sm font-medium text-foreground truncate"
                        title={req.title}
                      >
                        {req.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium text-foreground/80">
                          {categoryName}
                        </span>
                        <span>•</span>
                        <span>{wardName}</span>
                        <span>•</span>
                        <span>Filed {dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link href={`/dashboard/requests/${req.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs h-8"
                      >
                        <FileText className="size-3.5" />
                        Details
                        <ChevronRight className="size-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
