"use client";

import {
  AlertCircle,
  ArrowRight,
  Ban,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUpdateStatus } from "@/hooks";
import type { RequestStatus, ServiceRequest } from "@/types";

// State machine transition matrix matching backend
export const STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  SUBMITTED: ["UNDER_REVIEW", "ASSIGNED", "REJECTED"],
  UNDER_REVIEW: ["ASSIGNED", "PENDING", "REJECTED"],
  ASSIGNED: ["IN_PROGRESS", "UNDER_REVIEW"],
  IN_PROGRESS: ["RESOLVED", "PENDING", "UNDER_REVIEW"],
  PENDING: ["IN_PROGRESS", "UNDER_REVIEW", "REJECTED"],
  RESOLVED: ["CLOSED", "REOPENED"],
  REOPENED: ["UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS"],
  CLOSED: ["REOPENED"],
  REJECTED: [],
};

interface StatusOption {
  status: RequestStatus;
  label: string;
  description: string;
  icon: typeof Wrench;
  colorClass: string;
}

const CANDIDATE_STATUSES: StatusOption[] = [
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    description: "Work has commenced on-site or field inspection is underway.",
    icon: Wrench,
    colorClass:
      "border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/5",
  },
  {
    status: "RESOLVED",
    label: "Resolved",
    description: "Issue has been fixed, tested, and verified on location.",
    icon: CheckCircle2,
    colorClass:
      "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5",
  },
  {
    status: "PENDING",
    label: "Pending / On Hold",
    description:
      "Paused awaiting materials, permit clearance, or citizen access.",
    icon: Clock,
    colorClass:
      "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5",
  },
  {
    status: "UNDER_REVIEW",
    label: "Under Review",
    description: "Return ticket to department supervisor for reassessment.",
    icon: AlertCircle,
    colorClass:
      "border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/5",
  },
];

interface StatusUpdateDialogProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StatusUpdateDialog({
  request,
  open,
  onOpenChange,
  onSuccess,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(
    null,
  );
  const [note, setNote] = useState<string>("");

  const { mutate: updateStatus, isPending } = useUpdateStatus();

  if (!request) return null;

  const currentStatus = request.status;
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];

  const handleClose = () => {
    setSelectedStatus(null);
    setNote("");
    onOpenChange(false);
  };

  const handleSelectStatus = (status: RequestStatus) => {
    if (!allowedTransitions.includes(status)) return;
    setSelectedStatus(status);
  };

  const handleSubmit = () => {
    if (!selectedStatus) {
      toast.add({
        title: "Selection Required",
        description: "Please select an allowed target status.",
        type: "warning",
      });
      return;
    }

    if (!allowedTransitions.includes(selectedStatus)) {
      toast.add({
        title: "Invalid Transition",
        description: `Cannot transition from ${currentStatus} to ${selectedStatus}.`,
        type: "error",
      });
      return;
    }

    updateStatus(
      {
        requestId: request.id,
        payload: {
          toStatus: selectedStatus,
          note: note.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Status Transition Successful",
            description: `Case ${request.requestNo} transitioned from ${currentStatus} to ${selectedStatus}.`,
            type: "success",
          });
          handleClose();
          onSuccess?.();
        },
        onError: (err: Error) => {
          toast.add({
            title: "Status Transition Failed",
            description:
              err?.message ||
              "Failed to update request status. Please verify permissions.",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base font-semibold">
              Update Casework Status
            </DialogTitle>
            <Badge variant="outline" className="font-mono text-xs text-primary">
              {request.requestNo}
            </Badge>
          </div>
          <DialogDescription
            className="text-xs text-muted-foreground truncate"
            title={request.title}
          >
            {request.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Current Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
            <span className="text-xs text-muted-foreground font-medium">
              Current Status:
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={currentStatus} />
              {allowedTransitions.length === 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  Terminal State
                </Badge>
              )}
            </div>
          </div>

          {/* New Status Selection Matrix */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Select New Target Status
            </span>

            <div className="space-y-2">
              {CANDIDATE_STATUSES.map((option) => {
                const Icon = option.icon;
                const isAllowed = allowedTransitions.includes(option.status);
                const isSelected = selectedStatus === option.status;

                return (
                  <button
                    key={option.status}
                    type="button"
                    disabled={!isAllowed || isPending}
                    onClick={() => handleSelectStatus(option.status)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isAllowed
                        ? isSelected
                          ? `${option.colorClass} ring-2 ring-primary border-primary`
                          : "hover:bg-muted/50 cursor-pointer border-border"
                        : "opacity-45 cursor-not-allowed bg-muted/30 border-dashed border-border/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 shrink-0" />
                        <span className="text-xs font-semibold">
                          {option.label}
                        </span>
                      </div>

                      {isAllowed ? (
                        isSelected ? (
                          <Badge
                            variant="default"
                            className="text-[10px] py-0 px-1.5"
                          >
                            Selected
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            Allowed
                          </span>
                        )
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                          <Ban className="size-2.5 text-destructive" />
                          Disabled from {currentStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operational Reason / Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="status-action-note"
                className="text-xs font-semibold text-foreground"
              >
                Casework Reason / Action Note
              </label>
              <span className="text-[10px] text-muted-foreground">
                {note.length}/1000
              </span>
            </div>
            <Textarea
              id="status-action-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 1000))}
              placeholder="Provide reason for this status change, actions taken, or blockers encountered..."
              className="text-xs min-h-[75px] resize-none"
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={
              !selectedStatus ||
              !allowedTransitions.includes(selectedStatus) ||
              isPending
            }
            className="gap-1.5"
          >
            {isPending ? (
              <>
                <Spinner className="size-3.5" />
                Transitioning...
              </>
            ) : (
              <>
                <span>Confirm Transition</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
