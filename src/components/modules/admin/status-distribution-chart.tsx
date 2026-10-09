"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatusDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface StatusDistributionChartProps {
  data?: StatusDistributionItem[];
  totalCount?: number;
  className?: string;
}

const defaultStatusData: StatusDistributionItem[] = [
  { name: "Resolved", value: 85, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#f59e0b" },
  { name: "Assigned", value: 16, color: "#06b6d4" },
  { name: "Triaged", value: 12, color: "#8b5cf6" },
  { name: "Submitted", value: 9, color: "#3b82f6" },
  { name: "Rejected", value: 4, color: "#ef4444" },
];

export function StatusDistributionChart({
  data = defaultStatusData,
  totalCount,
  className,
}: StatusDistributionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = totalCount ?? data.reduce((acc, curr) => acc + curr.value, 0);

  if (!isMounted) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-60 mt-1" />
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Current breakdown of active and concluded complaints
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {total} Total
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    const percent =
                      total > 0
                        ? (((item.value as number) / total) * 100).toFixed(1)
                        : "0";
                    return (
                      <div className="rounded-lg border bg-popover/95 p-2.5 shadow-lg backdrop-blur-sm text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: item.payload.color }}
                          />
                          <span className="font-semibold text-foreground">
                            {item.name}:
                          </span>
                          <span className="font-bold text-foreground">
                            {item.value} ({percent}%)
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="46%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                align="center"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Summary */}
          <div className="absolute inset-0 top-[-25px] flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {total}
            </span>
            <span className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground">
              Requests
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
