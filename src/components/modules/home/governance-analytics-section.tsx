"use client";

import {
  Activity,
  AlertOctagon,
  BarChart3,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  PhoneCall,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeAdaptiveImage } from "@/components/ui/theme-adaptive-image";

interface WardData {
  ward: string;
  filed: number;
  resolved: number;
}

const WARD_METRICS: WardData[] = [
  { ward: "W01", filed: 140, resolved: 135 },
  { ward: "W02", filed: 120, resolved: 114 },
  { ward: "W03", filed: 165, resolved: 158 },
  { ward: "W04", filed: 95, resolved: 90 },
  { ward: "W05", filed: 180, resolved: 172 },
  { ward: "W06", filed: 110, resolved: 104 },
  { ward: "W07", filed: 210, resolved: 201 },
  { ward: "W08", filed: 175, resolved: 168 },
  { ward: "W09", filed: 130, resolved: 122 },
  { ward: "W10", filed: 190, resolved: 182 },
  { ward: "W11", filed: 145, resolved: 139 },
  { ward: "W12", filed: 230, resolved: 221 },
];

export function GovernanceAnalyticsSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative border-b bg-muted/10 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
            <Activity className="size-3.5" />
            Civic Transparency Index
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            A City That Shows Its Work
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Audited municipal performance metrics across all 54 administrative
            wards, statutory turnaround compliance, and emergency assistance channels.
          </p>
        </div>

        {/* Panoramic Cityscape Banner with Live Civic Annotations */}
        <div className="relative mt-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-950 shadow-xl dark:border-slate-800">
          <div className="relative aspect-[21/9] min-h-[260px] w-full">
            <ThemeAdaptiveImage
              lightSrc="/images/civic/cityscape-light.png"
              darkSrc="/images/civic/cityscape-dark.png"
              alt="Panoramic Citycare Skyline with Digital Governance Overlays"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />

            {/* Gradient Overlay for Contrast */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40" />

            {/* Floating Banner Title & Civic Milestones */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur-md">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  MUNICIPAL WIDE TELEMETRY • LIVE
                </span>
                <span className="hidden font-mono text-xs text-slate-300 sm:inline-block">
                  SLA STANDARD ISO-37120
                </span>
              </div>

              {/* 4 Milestones Pinned Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400">
                    <Sparkles className="size-3" />
                    Clean Streets
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                    1,240+ Tons
                  </p>
                  <p className="text-[10px] text-slate-400">Solid waste collected</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                    <Building className="size-3" />
                    Better Roads
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                    842 Repaired
                  </p>
                  <p className="text-[10px] text-slate-400">Asphalt patches sealed</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-yellow-400">
                    <Flame className="size-3" />
                    Illumination
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                    312 Relamped
                  </p>
                  <p className="text-[10px] text-slate-400">LED fixtures restored</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    Water Security
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                    98.6%
                  </p>
                  <p className="text-[10px] text-slate-400">WASA pipeline integrity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Operational Grid: Ward Performance Chart & SLA Compliance */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Recharts Ward Bar Chart */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <BarChart3 className="size-4 text-primary" />
                      Ward Resolution Output (W01 to W12)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Monthly comparison of citizen complaints registered vs. verified repairs.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    95.4% AVG
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {isMounted ? (
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={WARD_METRICS}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted/40"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="ward"
                          tickLine={false}
                          className="text-[11px] font-mono fill-muted-foreground"
                        />
                        <YAxis
                          tickLine={false}
                          className="text-[11px] font-mono fill-muted-foreground"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            borderRadius: "8px",
                            fontSize: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="filed"
                          name="Reports Filed"
                          fill="#38bdf8"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="resolved"
                          name="Repairs Verified"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[280px] flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: SLA Compliance & Emergency Helplines */}
          <div className="space-y-6 lg:col-span-5">
            {/* SLA Gauge Breakdown Card */}
            <Card className="border border-slate-200/90 bg-card shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="size-4 text-emerald-500" />
                  Statutory SLA Compliance
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Official municipal response timeline adherence for all active cases.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      On-Time Resolution (Within Target)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      95.4%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: "95.4%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      Resolved in Grace Period (+6 hrs)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      3.1%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: "3.1%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      Escalated to Zonal Mayor
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      1.5%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: "1.5%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Hotline & Helpdesk Card */}
            <Card className="border border-sky-200/80 bg-gradient-to-br from-sky-50/70 to-blue-50/40 p-5 shadow-sm dark:border-sky-900/50 dark:from-sky-950/30 dark:to-slate-900">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                  <PhoneCall className="size-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Direct Civic Helplines (24/7 Toll-Free)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    For life-threatening hazards, open high-voltage cables, or
                    gas leak emergencies, dial emergency services immediately:
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-sky-200/60 bg-card p-2.5 text-center dark:border-slate-800">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    National Civic Info
                  </span>
                  <span className="block font-mono text-xl font-black text-primary">
                    333
                  </span>
                </div>
                <div className="rounded-lg border border-rose-200/60 bg-card p-2.5 text-center dark:border-slate-800">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    Emergency Hotline
                  </span>
                  <span className="block font-mono text-xl font-black text-rose-600 dark:text-rose-400">
                    999
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-sky-200/60 pt-3 dark:border-slate-800 text-xs">
                <span className="text-muted-foreground">
                  Online Triage Desk Active
                </span>
                <Link
                  href="/dashboard/submit-request?priority=URGENT"
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Lodge Urgent Ticket <ExternalLink className="size-3" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
