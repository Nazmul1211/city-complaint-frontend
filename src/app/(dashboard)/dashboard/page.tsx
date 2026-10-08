import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";

export default function CitizenOverviewPage() {
  const recentCases = [
    {
      id: "req-1",
      requestNo: "REQ-2026-0891",
      title: "Deep Pothole on Mirpur-10 Main Intersection",
      category: "Road Pothole",
      status: "RESOLVED" as const,
      priority: "HIGH" as const,
      date: "Yesterday",
    },
    {
      id: "req-2",
      requestNo: "REQ-2026-0902",
      title: "Drinking Water Pipeline Burst on Lake Road",
      category: "Water Pipeline",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      date: "Today at 07:15 AM",
    },
    {
      id: "req-3",
      requestNo: "REQ-2026-0915",
      title: "Streetlight Strip Dark on Main Boulevard",
      category: "Streetlight Outage",
      status: "ASSIGNED" as const,
      priority: "MEDIUM" as const,
      date: "Today at 11:20 AM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Citizen Civic Overview
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Welcome back. Monitor ongoing neighborhood casework, file new
            service petitions, and review verified repairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/submit-request">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="size-4" />
              Lodge Complaint
            </Button>
          </Link>
          <Link href="/track">
            <Button variant="outline" size="sm">
              Public Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Filed Cases
            </CardTitle>
            <FileText className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Across 3 municipal wards
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
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Technicians dispatched on-site
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
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Inspected & sign-off complete
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
            <div className="text-2xl font-bold text-foreground">Verified</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Citizen Level 1 Account
            </p>
          </CardContent>
        </Card>
      </div>

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
          <Link href="/dashboard/requests">
            <Button
              variant="ghost"
              size="xs"
              className="gap-1 text-xs text-primary"
            >
              View All ({4})
              <ArrowRight className="size-3" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-3 pt-1">
          {recentCases.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-md border p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
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
                  {item.category} • Filed {item.date}
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
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
