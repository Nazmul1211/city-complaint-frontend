import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResolvedCase {
  requestNo: string;
  title: string;
  department: string;
  ward: string;
  resolutionTime: string;
  resolutionNote: string;
  date: string;
}

const RECENT_RESOLVED_CASES: ResolvedCase[] = [
  {
    requestNo: "REQ-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    department: "Public Works & Road Maintenance",
    ward: "Ward 12",
    resolutionTime: "24 hrs (SLA: 48h)",
    resolutionNote:
      "Asphalt patch poured, steam-roller compacted, and lane reopened.",
    date: "2 hours ago",
  },
  {
    requestNo: "REQ-2026-0884",
    title: "Faulty Transformer & Dark Streetlight Strip",
    department: "Electrical & Street Lighting",
    ward: "Ward 08",
    resolutionTime: "14 hrs (SLA: 24h)",
    resolutionNote:
      "Capacitor replaced on sub-station feeder 3; 12 LED poles restored.",
    date: "Yesterday",
  },
  {
    requestNo: "REQ-2026-0873",
    title: "Overflowing Garbage Dumpster on Road 7",
    department: "Solid Waste Management",
    ward: "Ward 19",
    resolutionTime: "8 hrs (SLA: 12h)",
    resolutionNote:
      "Compactor truck cleared 4.5 tons of overflow; area bleached and sanitized.",
    date: "2 days ago",
  },
];

export function RecentResolvedShowcase() {
  return (
    <section className="bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              Verified Public Outcomes
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Recently Resolved In Your City
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              See how civic complaints in different wards are being inspected
              and resolved daily.
            </p>
          </div>
          <Link href="/track">
            <Button variant="outline" size="sm" className="gap-2">
              Track Any Case Number
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {RECENT_RESOLVED_CASES.map((item) => (
            <Card
              key={item.requestNo}
              className="flex flex-col justify-between border bg-card"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {item.requestNo}
                  </span>
                  <Badge variant="success">RESOLVED</Badge>
                </div>
                <CardTitle className="mt-2 text-base font-semibold text-foreground line-clamp-1">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{item.department}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    {item.ward}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Clock className="size-3.5 shrink-0" />
                    {item.resolutionTime}
                  </span>
                </div>
                <div className="rounded-md border bg-muted/50 p-2.5 text-xs text-foreground">
                  <span className="font-medium text-muted-foreground">
                    Technician Note:{" "}
                  </span>
                  {item.resolutionNote}
                </div>
              </CardContent>
              <CardFooter className="pt-2 text-xs text-muted-foreground border-t">
                <span>Completed {item.date}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
