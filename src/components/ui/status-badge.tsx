import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RequestPriority, RequestStatus } from "@/types";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "SUBMITTED":
      return (
        <Badge
          variant="outline"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <Clock className="size-3" />
          SUBMITTED
        </Badge>
      );
    case "UNDER_REVIEW":
      return (
        <Badge
          variant="info"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <AlertCircle className="size-3" />
          UNDER REVIEW
        </Badge>
      );
    case "ASSIGNED":
      return (
        <Badge
          variant="info"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <UserCheck className="size-3" />
          ASSIGNED
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="warning"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <Clock className="size-3 animate-spin" />
          IN PROGRESS
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="warning"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <Clock className="size-3" />
          PENDING
        </Badge>
      );
    case "RESOLVED":
      return (
        <Badge
          variant="success"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <CheckCircle2 className="size-3" />
          RESOLVED
        </Badge>
      );
    case "CLOSED":
      return (
        <Badge
          variant="secondary"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <CheckCircle2 className="size-3" />
          CLOSED
        </Badge>
      );
    case "REOPENED":
      return (
        <Badge
          variant="destructive"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <RotateCcw className="size-3" />
          REOPENED
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="destructive"
          className={`gap-1 font-mono text-[11px] ${className}`}
        >
          <XCircle className="size-3" />
          REJECTED
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={`font-mono text-[11px] ${className}`}
        >
          {status}
        </Badge>
      );
  }
}

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  switch (priority) {
    case "URGENT":
      return (
        <Badge
          variant="destructive"
          className={`gap-1 font-mono text-[10px] font-bold ${className}`}
        >
          <AlertTriangle className="size-2.5" />
          URGENT
        </Badge>
      );
    case "HIGH":
      return (
        <Badge
          variant="warning"
          className={`font-mono text-[10px] font-bold ${className}`}
        >
          HIGH
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge variant="info" className={`font-mono text-[10px] ${className}`}>
          MEDIUM
        </Badge>
      );
    case "LOW":
      return (
        <Badge
          variant="outline"
          className={`font-mono text-[10px] ${className}`}
        >
          LOW
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={`font-mono text-[10px] ${className}`}
        >
          {priority}
        </Badge>
      );
  }
}
