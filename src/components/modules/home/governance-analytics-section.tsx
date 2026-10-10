"use client";

import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WardData {
  ward: string;
  resolved: number;
}

const WARD_METRICS: WardData[] = [
  { ward: "W01", resolved: 90 },
  { ward: "W02", resolved: 110 },
  { ward: "W04", resolved: 120 },
  { ward: "W05", resolved: 140 },
  { ward: "W06", resolved: 105 },
  { ward: "W07", resolved: 95 },
  { ward: "W08", resolved: 130 },
  { ward: "W09", resolved: 150 },
  { ward: "W10", resolved: 115 },
  { ward: "W11", resolved: 135 },
  { ward: "W12", resolved: 100 },
];

export function GovernanceAnalyticsSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="border-b bg-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 3-Column Section with Synchronized Matching Heights */}
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
          {/* Column 1: A city that shows its work with Cityscape Panorama Background */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border shadow-sm p-6 lg:col-span-5 min-h-[260px] h-full">
            {/* Background Image: Light Mode Cityscape */}
            <div className="block dark:hidden absolute inset-0 size-full pointer-events-none">
              <Image
                src="/images/civic/cityscape-light.png"
                alt="Civic Data Cityscape Panorama (Light)"
                fill
                priority
                className="object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />
            </div>

            {/* Background Image: Dark Mode Cityscape */}
            <div className="hidden dark:block absolute inset-0 size-full pointer-events-none">
              <Image
                src="/images/civic/cityscape-dark.png"
                alt="Smart City Night Panorama (Dark)"
                fill
                priority
                className="object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040813]/95 via-[#040813]/85 to-[#040813]/50" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/90 px-3 py-0.5 text-[11px] font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                <ShieldCheck className="size-3" />
                <span>DATA DRIVEN GOVERNANCE</span>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl leading-tight">
                A city that shows its work.
              </h2>

              <p className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Transparent governance through real data, real progress and real impact.
                Explore SLA performance, ward activity and verified resolutions.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link href="/services">
                <Button
                  size="default"
                  className="gap-2 rounded-lg bg-[#0284c7] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0369a1] dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
                >
                  View city performance
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Column 2: Cases Resolved by Ward Bar Chart Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c1322] lg:col-span-4 min-h-[260px] h-full">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold text-foreground sm:text-sm">
                Cases Resolved by Ward (Last 30 Days)
              </h3>
              <div className="flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <span>Last 30 days</span>
                <ChevronDown className="size-3" />
              </div>
            </div>

            <div className="h-[175px] w-full pt-1">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={WARD_METRICS}
                    margin={{ top: 8, right: 0, left: -28, bottom: -5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted/30"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="ward"
                      tickLine={false}
                      className="text-[9px] font-mono fill-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 150]}
                      ticks={[0, 50, 100, 150]}
                      tickLine={false}
                      className="text-[9px] font-mono fill-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        padding: "4px 8px",
                      }}
                    />
                    <Bar
                      dataKey="resolved"
                      name="Cases Resolved"
                      fill="#0284c7"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="size-full rounded-md" />
              )}
            </div>
          </div>

          {/* Column 3: SLA Performance Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c1322] lg:col-span-3 min-h-[260px] h-full">
            <h3 className="text-xs font-bold text-foreground sm:text-sm">
              SLA Performance
            </h3>

            <div className="space-y-4 my-auto py-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Resolved On Time</span>
                </div>
                <span className="font-bold text-foreground">95.4%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Resolved (Late)</span>
                </div>
                <span className="font-bold text-foreground">3.1%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-rose-500" />
                  <span className="text-muted-foreground">Overdue</span>
                </div>
                <span className="font-bold text-foreground">1.5%</span>
              </div>
            </div>

            <div className="border-t pt-2 text-[11px] text-muted-foreground">
              Official ISO-37120 Municipal Standard
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
