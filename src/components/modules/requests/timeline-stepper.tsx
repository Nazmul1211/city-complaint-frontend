import {
  Building2,
  CheckCircle2,
  FileText,
  GitPullRequest,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import type { TimelineEvent } from "@/types";

interface TimelineStepperProps {
  events: TimelineEvent[];
}

export function TimelineStepper({ events }: TimelineStepperProps) {
  if (!events || events.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No audit timeline entries recorded yet.
      </p>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
      {events.map((evt, idx) => {
        const type = (
          evt.type ||
          evt.eventType ||
          "STATUS_CHANGED"
        ).toUpperCase();
        const dateStr = evt.timestamp || evt.createdAt;
        const formattedDate = dateStr
          ? new Date(dateStr).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Recorded";

        let Icon = FileText;
        let iconBg = "bg-primary/10 text-primary";

        if (type.includes("SUBMIT")) {
          Icon = FileText;
          iconBg = "bg-primary/10 text-primary";
        } else if (type.includes("ROUTE")) {
          Icon = GitPullRequest;
          iconBg = "bg-sky-500/10 text-sky-600 dark:text-sky-400";
        } else if (type.includes("ASSIGN")) {
          Icon = UserCheck;
          iconBg = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
        } else if (type.includes("RESOLV") || type.includes("CLOSE")) {
          Icon = CheckCircle2;
          iconBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        } else {
          Icon = RefreshCw;
          iconBg = "bg-muted text-muted-foreground";
        }

        return (
          <div key={`${evt.id || idx}-${type}`} className="relative group">
            {/* Dot / Icon */}
            <div
              className={`absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-background ring-2 ring-background ${iconBg}`}
            >
              <Icon className="size-2.5" />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-xs text-foreground">
                  {evt.title || evt.note || type.replace("_", " ")}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formattedDate}
                </span>
              </div>

              {evt.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {evt.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                {evt.actor && (
                  <span className="font-medium text-foreground">
                    By: {evt.actor.name || evt.actor.email}
                  </span>
                )}
                {evt.department && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    <Building2 className="size-2.5" />
                    {evt.department.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
