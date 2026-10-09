"use client";

import { AlertOctagon, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RequestPriority } from "@/types";

interface PriorityTagProps {
  priority: RequestPriority | string;
  className?: string;
  showIcon?: boolean;
}

export function PriorityTag({
  priority,
  className = "",
  showIcon = true,
}: PriorityTagProps) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="relative inline-flex items-center">
          <Badge
            variant="destructive"
            className={`gap-1.5 font-mono text-[11px] font-bold tracking-wider shadow-sm ring-1 ring-destructive/40 animate-pulse ${className}`}
          >
            {showIcon && <AlertOctagon className="size-3 shrink-0" />}
            <span className="inline-block size-1.5 rounded-full bg-white animate-ping mr-0.5" />
            URGENT
          </Badge>
        </span>
      );

    case "HIGH":
      return (
        <Badge
          variant="warning"
          className={`gap-1 font-mono text-[11px] font-semibold tracking-wide border-amber-500/30 ${className}`}
        >
          {showIcon && (
            <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          HIGH
        </Badge>
      );

    case "MEDIUM":
      return (
        <Badge
          variant="info"
          className={`gap-1 font-mono text-[11px] tracking-wide border-blue-500/30 ${className}`}
        >
          {showIcon && <ArrowUp className="size-3 text-blue-500 shrink-0" />}
          MEDIUM
        </Badge>
      );

    case "LOW":
      return (
        <Badge
          variant="outline"
          className={`gap-1 font-mono text-[11px] text-muted-foreground ${className}`}
        >
          {showIcon && (
            <ArrowDown className="size-3 text-muted-foreground shrink-0" />
          )}
          LOW
        </Badge>
      );

    default:
      return (
        <Badge
          variant="outline"
          className={`font-mono text-[11px] ${className}`}
        >
          {priority}
        </Badge>
      );
  }
}
