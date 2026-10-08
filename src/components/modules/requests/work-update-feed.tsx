import { UserCheck, Wrench } from "lucide-react";
import type { WorkUpdate } from "@/types";

interface WorkUpdateFeedProps {
  updates: WorkUpdate[];
}

export function WorkUpdateFeed({ updates }: WorkUpdateFeedProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
        <Wrench className="size-8 text-muted-foreground" />
        <p className="mt-2 text-xs font-semibold text-foreground">
          No field reports logged yet
        </p>
        <p className="text-[11px] text-muted-foreground">
          Technician inspection notes and equipment logs will appear here once
          dispatched.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((item) => {
        const text = item.note || item.description || "Field inspection update";
        const authorName =
          item.author?.name || item.staff?.name || "Assigned Field Staff";
        const dateStr = item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Logged";

        return (
          <div
            key={item.id}
            className="rounded-lg border bg-card p-4 space-y-2 text-xs text-foreground"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <UserCheck className="size-3.5" />
                <span>{authorName}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {dateStr}
              </span>
            </div>
            <p className="leading-relaxed text-muted-foreground">{text}</p>
          </div>
        );
      })}
    </div>
  );
}
