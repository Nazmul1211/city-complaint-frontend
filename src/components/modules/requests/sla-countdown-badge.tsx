import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types";

interface SlaCountdownBadgeProps {
  status: RequestStatus;
  resolutionDueAt?: string | null;
  resolvedAt?: string | null;
  responseDueAt?: string | null;
}

export function SlaCountdownBadge({
  status,
  resolutionDueAt,
  resolvedAt: _resolvedAt,
  responseDueAt,
}: SlaCountdownBadgeProps) {
  if (status === "RESOLVED" || status === "CLOSED") {
    return (
      <Badge variant="success" className="gap-1 font-mono text-xs">
        <CheckCircle2 className="size-3.5" />
        SLA Met & Verified
      </Badge>
    );
  }

  const targetDateStr = resolutionDueAt || responseDueAt;
  if (!targetDateStr) {
    return (
      <Badge variant="outline" className="gap-1 font-mono text-xs">
        <Clock className="size-3.5 text-muted-foreground" />
        SLA Under Standard Policy (48h)
      </Badge>
    );
  }

  const targetTime = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diffHours = Math.round((targetTime - now) / (1000 * 3600));

  if (diffHours < 0) {
    const overdueHours = Math.abs(diffHours);
    return (
      <Badge
        variant="destructive"
        className="gap-1 font-mono text-xs font-bold animate-pulse"
      >
        <AlertTriangle className="size-3.5" />
        Overdue by {overdueHours}h
      </Badge>
    );
  }

  if (diffHours <= 6) {
    return (
      <Badge
        variant="warning"
        className="gap-1 font-mono text-xs font-semibold"
      >
        <Clock className="size-3.5" />
        Due Soon: {diffHours}h remaining
      </Badge>
    );
  }

  return (
    <Badge variant="info" className="gap-1 font-mono text-xs">
      <Clock className="size-3.5" />
      SLA Window: {diffHours}h remaining
    </Badge>
  );
}
