import { Clock, FileText, RotateCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SlaCommitment {
  title: string;
  badge: string;
  description: string;
  metric: string;
  icon: typeof Clock;
}

const COMMITMENTS: SlaCommitment[] = [
  {
    title: "Enforced Response SLA",
    badge: "12–24h Guaranteed",
    description:
      "Every filed complaint undergoes automated category routing and is acknowledged by a dedicated department officer within official statutory deadlines.",
    metric: "98.2% on-time initial response",
    icon: Clock,
  },
  {
    title: "Photographic On-Site Proof",
    badge: "Mandatory Evidence",
    description:
      "Field technicians cannot mark a complaint as resolved without attaching time-stamped, geo-tagged photos demonstrating the completed municipal work.",
    metric: "100% photo verification required",
    icon: ShieldCheck,
  },
  {
    title: "Citizen Reopening Rights",
    badge: "48h Reopen Window",
    description:
      "If road asphalt cracks again or a drain clogs immediately after repair, the citizen can reopen the ticket directly without resubmitting a new form.",
    metric: "Guaranteed secondary inspection",
    icon: RotateCcw,
  },
  {
    title: "Immutable Public Audit Trail",
    badge: "Zero Tampering",
    description:
      "All assignment transitions, officer notes, and timestamps are permanently logged, ensuring municipal transparency and anti-corruption oversight.",
    metric: "Auditable by city council",
    icon: FileText,
  },
];

export function SlaCommitmentCard() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {COMMITMENTS.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm transition-all hover:border-[#0284c7]/40 dark:border-slate-800/80 dark:bg-[#0c1427]"
          >
            <CardHeader className="p-0 pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8]">
                  <Icon className="size-4" />
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] font-bold border-sky-300 text-[#0284c7] dark:border-sky-800 dark:text-sky-300"
                >
                  {item.badge}
                </Badge>
              </div>
              <CardTitle className="mt-3 text-base font-bold text-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 pt-1 text-xs text-muted-foreground">
              <p className="leading-relaxed">{item.description}</p>
              <div className="border-t border-border/50 pt-3 font-medium text-foreground">
                <span className="text-muted-foreground">Standard: </span>
                <span className="text-[#0284c7] dark:text-[#38bdf8] font-bold">
                  {item.metric}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
