import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  FileText,
  MapPin,
  PieChart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  isNeutral?: boolean;
  icon: typeof FileText;
  bars: number[];
}

const STATS: StatItem[] = [
  {
    label: "Total Reports Filed",
    value: "18,420+",
    delta: "+12% from last month",
    deltaPositive: true,
    icon: FileText,
    bars: [25, 35, 45, 40, 60, 75, 90, 100],
  },
  {
    label: "Resolution SLA Rate",
    value: "95.4%",
    delta: "+2.3% from last month",
    deltaPositive: true,
    icon: PieChart,
    bars: [60, 65, 70, 78, 85, 90, 94, 98],
  },
  {
    label: "Average Turnaround",
    value: "32.6 hrs",
    delta: "-18% from last month",
    deltaPositive: true, // Reduced turnaround is an improvement
    icon: Clock,
    bars: [95, 85, 80, 70, 60, 55, 45, 38],
  },
  {
    label: "Active Municipal Wards",
    value: "54",
    delta: "100% digitized coverage",
    deltaPositive: true,
    isNeutral: true,
    icon: MapPin,
    bars: [40, 50, 60, 70, 80, 90, 100, 100],
  },
];

function BarSparkline({ bars, positive }: { bars: number[]; positive: boolean }) {
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden="true">
      {bars.map((height, idx) => (
        <span
          key={idx}
          style={{ height: `${height}%` }}
          className={`w-1 rounded-t-sm transition-all ${
            positive
              ? "bg-[#0284c7]/40 group-hover:bg-[#0284c7] dark:bg-[#38bdf8]/40 dark:group-hover:bg-[#38bdf8]"
              : "bg-emerald-500/40 group-hover:bg-emerald-500"
          }`}
        />
      ))}
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="border-b bg-card/40 py-6 md:py-8 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="group border border-border/80 bg-card p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
              >
                <CardContent className="flex items-center justify-between p-0">
                  <div className="flex items-center gap-3.5">
                    {/* Blue Icon Squircle */}
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-[#0284c7] dark:bg-sky-500/15 dark:text-[#38bdf8]">
                      <Icon className="size-5" />
                    </div>

                    {/* Numeric Value & Label */}
                    <div>
                      <div className="text-2xl font-extrabold tracking-tight text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </div>
                      <div className="mt-1 flex items-center text-[11px] font-semibold">
                        {stat.isNeutral ? (
                          <span className="text-muted-foreground">
                            {stat.delta}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                            {stat.delta.startsWith("-") ? (
                              <ArrowDownRight className="size-3 mr-0.5" />
                            ) : (
                              <ArrowUpRight className="size-3 mr-0.5" />
                            )}
                            {stat.delta}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sparkline Graphic on the Right */}
                  <BarSparkline bars={stat.bars} positive={stat.deltaPositive} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
