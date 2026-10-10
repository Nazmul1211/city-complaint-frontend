"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface MonthlyTrendData {
  month: string;
  submitted: number;
  resolved: number;
}

interface ComplaintsTrendChartProps {
  data?: MonthlyTrendData[];
  className?: string;
}

export function ComplaintsTrendChart({
  data = [],
  className,
}: ComplaintsTrendChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalSubmitted = data.reduce((acc, curr) => acc + curr.submitted, 0);
  const totalResolved = data.reduce((acc, curr) => acc + curr.resolved, 0);

  if (!isMounted) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <CardTitle className="text-base font-semibold">
              Complaint Volume & Resolution Trends
            </CardTitle>
            <CardDescription className="text-xs">
              Monthly inflow of citizen complaints vs completed resolutions
            </CardDescription>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md self-start sm:self-auto">
            {totalSubmitted > 0
              ? `${totalResolved} of ${totalSubmitted} Resolved`
              : "Live Timeline Active"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="submittedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient
                  id="resolvedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/40"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="currentColor"
                className="text-[11px] text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-[11px] text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-popover/95 p-3 shadow-lg backdrop-blur-sm text-xs">
                        <p className="font-semibold text-foreground mb-1">
                          {label}
                        </p>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="size-2 rounded-full bg-blue-500" />
                            <span>Submitted:</span>
                            <span className="font-bold">
                              {payload[0]?.value}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span>Resolved:</span>
                            <span className="font-bold">
                              {payload[1]?.value}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={30}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
              />
              <Area
                type="monotone"
                dataKey="submitted"
                name="Submitted"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#submittedGradient)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolved"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#resolvedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
