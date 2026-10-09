"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface DepartmentMetricData {
  department: string;
  total: number;
  resolved: number;
  rate: number; // percentage
}

interface DepartmentPerformanceChartProps {
  data?: DepartmentMetricData[];
  className?: string;
}

const defaultDepartmentData: DepartmentMetricData[] = [
  { department: "Roads & Highways", total: 42, resolved: 36, rate: 85.7 },
  { department: "Water & Sewerage", total: 38, resolved: 32, rate: 84.2 },
  { department: "Waste Management", total: 55, resolved: 51, rate: 92.7 },
  { department: "Electricity & Grid", total: 29, resolved: 24, rate: 82.8 },
  { department: "Parks & Recreation", total: 18, resolved: 17, rate: 94.4 },
  { department: "Public Health", total: 24, resolved: 20, rate: 83.3 },
];

export function DepartmentPerformanceChart({
  data = defaultDepartmentData,
  className,
}: DepartmentPerformanceChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-52" />
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
              Department Caseload & Resolution
            </CardTitle>
            <CardDescription className="text-xs">
              Assigned complaint volume vs resolved casework per municipal
              bureau
            </CardDescription>
          </div>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md self-start sm:self-auto">
            Avg Rate: 87.2%
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/40"
                vertical={false}
              />
              <XAxis
                dataKey="department"
                stroke="currentColor"
                className="text-[10px] text-muted-foreground"
                tickLine={false}
                axisLine={false}
                angle={-20}
                textAnchor="end"
                interval={0}
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
                    const rowData = payload[0]?.payload as DepartmentMetricData;
                    return (
                      <div className="rounded-lg border bg-popover/95 p-3 shadow-lg backdrop-blur-sm text-xs">
                        <p className="font-semibold text-foreground mb-1">
                          {label}
                        </p>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <span className="size-2 rounded-full bg-indigo-500" />
                            <span>Total Assigned:</span>
                            <span className="font-bold">{rowData?.total}</span>
                          </p>
                          <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span>Resolved:</span>
                            <span className="font-bold">
                              {rowData?.resolved}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 text-amber-600 dark:text-amber-400 pt-1 border-t border-border/50">
                            <span>Resolution Rate:</span>
                            <span className="font-bold">
                              {rowData?.rate?.toFixed(1)}%
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
              <Bar
                dataKey="total"
                name="Total Assigned"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
