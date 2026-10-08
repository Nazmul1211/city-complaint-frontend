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
            className="flex flex-col justify-between border bg-card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {item.badge}
                </Badge>
              </div>
              <CardTitle className="mt-3 text-base font-semibold text-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-4 text-xs text-muted-foreground">
              <p className="leading-relaxed">{item.description}</p>
              <div className="border-t pt-2.5 font-medium text-foreground">
                <span className="text-muted-foreground">Standard: </span>
                {item.metric}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
