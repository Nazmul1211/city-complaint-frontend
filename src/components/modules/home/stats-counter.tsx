import { CheckCircle2, Clock, FileText, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  description: string;
  icon: typeof FileText;
}

const STATS: StatItem[] = [
  {
    label: "Total Reports Filed",
    value: "18,420+",
    description: "Citizen reports registered across all municipal services",
    icon: FileText,
  },
  {
    label: "Resolution SLA Rate",
    value: "95.4%",
    description: "Cases resolved within official SLA turnaround windows",
    icon: CheckCircle2,
  },
  {
    label: "Average Turnaround",
    value: "32.6 hrs",
    description: "From citizen submission to verified on-site completion",
    icon: Clock,
  },
  {
    label: "Active Municipal Wards",
    value: "54 Wards",
    description: "Fully digitized municipal jurisdictions and field teams",
    icon: MapPin,
  },
];

export function StatsCounter() {
  return (
    <section className="border-b bg-muted/30 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Real Civic Impact in Real-Time
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Transparent public governance backed by accountable municipal
            metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {stat.value}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
