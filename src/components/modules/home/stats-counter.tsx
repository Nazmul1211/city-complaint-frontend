import {
  ArrowDownRight,
  ArrowUpRight,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  benchmark: string;
  description: string;
  icon: typeof FileText;
  sparkline: number[];
  color: string;
}

const STATS: StatItem[] = [
  {
    label: "Total Reports Filed",
    value: "18,420+",
    delta: "+12.4%",
    deltaPositive: true,
    benchmark: "vs last month",
    description: "Citizen reports filed across all 8 civic departments",
    icon: FileText,
    sparkline: [25, 32, 40, 38, 48, 55, 62, 70],
    color: "from-sky-500 to-blue-600",
  },
  {
    label: "Resolution SLA Rate",
    value: "95.4%",
    delta: "+2.3%",
    deltaPositive: true,
    benchmark: "target: 92%",
    description: "Casework completed within legal statutory SLA turnaround",
    icon: CheckCircle2,
    sparkline: [88, 89, 91, 92, 93, 94, 94.8, 95.4],
    color: "from-emerald-500 to-teal-600",
  },
  {
    label: "Average Turnaround",
    value: "32.6 hrs",
    delta: "-18.2%",
    deltaPositive: true, // Lower time is positive
    benchmark: "4.8h faster",
    description: "From citizen dispatch to verified on-site field sign-off",
    icon: Clock,
    sparkline: [48, 44, 42, 39, 36, 35, 33.8, 32.6],
    color: "from-amber-500 to-orange-600",
  },
  {
    label: "Active Digital Wards",
    value: "54 Wards",
    delta: "100%",
    deltaPositive: true,
    benchmark: "coverage",
    description: "Full municipal ward grid covered with digital GPS routing",
    icon: Building,
    sparkline: [40, 44, 48, 50, 52, 54, 54, 54],
    color: "from-indigo-500 to-purple-600",
  },
];

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible stroke-[2]"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={positive ? "#10b981" : "#f59e0b"}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatsCounter() {
  return (
    <section className="relative border-b bg-muted/30 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
              <TrendingUp className="size-3" />
              Real Civic Transparency
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Public Accountability at Municipal Scale
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Real-time audit metrics across all active municipal wards and field crews.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            UPDATED: HOURLY SYNC
          </Badge>
        </div>

        {/* 4 Responsive KPI Cards with Sparklines */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="group relative overflow-hidden border bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <MiniSparkline data={stat.sparkline} positive={stat.deltaPositive} />
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {stat.value}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-bold ${
                        stat.deltaPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {stat.deltaPositive ? (
                        <ArrowUpRight className="size-3.5" />
                      ) : (
                        <ArrowDownRight className="size-3.5" />
                      )}
                      {stat.delta}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {stat.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-dashed pt-2.5 text-[11px] text-muted-foreground">
                    <span>Performance Benchmark</span>
                    <span className="font-mono font-medium text-foreground">
                      {stat.benchmark}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
