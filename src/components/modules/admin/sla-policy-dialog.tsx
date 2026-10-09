"use client";

import { Clock, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useCreateCategorySla,
  useGetCategorySla,
  useUpdateCategorySla,
} from "@/hooks";
import type { Category, SlaPolicy } from "@/types";

interface SlaPolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess?: () => void;
}

export function SlaPolicyDialog({
  isOpen,
  onClose,
  category,
  onSuccess,
}: SlaPolicyDialogProps) {
  const categoryId = category?.id || "";
  const { data: slaResponse, isLoading: isLoadingSla } =
    useGetCategorySla(categoryId);
  const existingSla: SlaPolicy | null = slaResponse?.data || null;

  const { mutateAsync: createSla, isPending: isCreating } =
    useCreateCategorySla();
  const { mutateAsync: updateSla, isPending: isUpdating } =
    useUpdateCategorySla();
  const isSubmitting = isCreating || isUpdating;

  const [responseHours, setResponseHours] = useState<number>(24);
  const [resolutionHours, setResolutionHours] = useState<number>(48);
  const [reopenWindowHours, setReopenWindowHours] = useState<number>(168);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      if (existingSla) {
        setResponseHours(
          existingSla.responseWithinHours ?? existingSla.responseHours ?? 24,
        );
        setResolutionHours(
          existingSla.resolutionWithinHours ??
            existingSla.resolutionHours ??
            48,
        );
        setReopenWindowHours(existingSla.reopenWindowHours ?? 168);
        setIsActive(existingSla.isActive ?? true);
      } else if (category?.slaPolicy) {
        setResponseHours(
          category.slaPolicy.responseWithinHours ??
            category.slaPolicy.responseHours ??
            24,
        );
        setResolutionHours(
          category.slaPolicy.resolutionWithinHours ??
            category.slaPolicy.resolutionHours ??
            48,
        );
        setReopenWindowHours(category.slaPolicy.reopenWindowHours ?? 168);
        setIsActive(category.slaPolicy.isActive ?? true);
      } else {
        setResponseHours(24);
        setResolutionHours(48);
        setReopenWindowHours(168);
        setIsActive(true);
      }
    }
  }, [isOpen, existingSla, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    if (responseHours <= 0 || resolutionHours <= 0) {
      toast.add({
        title: "Validation Error",
        description:
          "SLA response and resolution times must be greater than zero.",
      });
      return;
    }

    try {
      const payload = {
        responseWithinHours: Number(responseHours),
        resolutionWithinHours: Number(resolutionHours),
        reopenWindowHours: Number(reopenWindowHours),
        isActive,
      };

      if (existingSla?.id) {
        await updateSla({
          categoryId: category.id,
          payload,
        });
        toast.add({
          title: "SLA Policy Updated",
          description: `Turnaround policy for "${category.name}" updated successfully.`,
        });
      } else {
        await createSla({
          categoryId: category.id,
          payload,
        });
        toast.add({
          title: "SLA Policy Enforced",
          description: `Statutory turnaround policy established for "${category.name}".`,
        });
      }

      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save SLA policy";
      toast.add({
        title: "Action Failed",
        description: errorMsg,
      });
    }
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Configure Category SLA Policy
              </DialogTitle>
              <DialogDescription className="text-xs">
                Set statutory response deadlines and resolution targets for
                compliance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoadingSla ? (
          <div className="flex flex-col items-center justify-center p-8 gap-2 text-xs text-muted-foreground">
            <Spinner className="size-4 text-primary" />
            <span>Loading category SLA metrics...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Target Category Header */}
            <div className="p-3 rounded-lg border bg-muted/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground truncate">
                  {category.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {existingSla ? "Active Policy" : "Unset Policy"}
                </Badge>
              </div>
              {category.department?.name && (
                <p className="text-[11px] text-muted-foreground">
                  Department: {category.department.name}
                </p>
              )}
            </div>

            {/* Response Time in Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="sla-response"
                  className="text-xs font-medium text-foreground"
                >
                  First Response SLA (hours) *
                </label>
                <span className="text-[10px] text-muted-foreground">
                  approx. {Math.round((responseHours / 24) * 10) / 10} days
                </span>
              </div>
              <Input
                id="sla-response"
                type="number"
                min="1"
                max="720"
                value={responseHours}
                onChange={(e) => setResponseHours(Number(e.target.value))}
                required
                disabled={isSubmitting}
                className="text-xs h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Time within which technician must acknowledge & inspect the
                issue.
              </p>
            </div>

            {/* Resolution Time in Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="sla-resolution"
                  className="text-xs font-medium text-foreground"
                >
                  Statutory Resolution SLA (hours) *
                </label>
                <span className="text-[10px] text-muted-foreground">
                  approx. {Math.round((resolutionHours / 24) * 10) / 10} days
                </span>
              </div>
              <Input
                id="sla-resolution"
                type="number"
                min="1"
                max="720"
                value={resolutionHours}
                onChange={(e) => setResolutionHours(Number(e.target.value))}
                required
                disabled={isSubmitting}
                className="text-xs h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Standard window to complete repair works and resolve complaint.
              </p>
            </div>

            {/* Reopen Window in Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="sla-reopen"
                  className="text-xs font-medium text-foreground"
                >
                  Citizen Reopen Window (hours)
                </label>
                <span className="text-[10px] text-muted-foreground">
                  approx. {Math.round((reopenWindowHours / 24) * 10) / 10} days
                </span>
              </div>
              <Input
                id="sla-reopen"
                type="number"
                min="1"
                max="720"
                value={reopenWindowHours}
                onChange={(e) => setReopenWindowHours(Number(e.target.value))}
                disabled={isSubmitting}
                className="text-xs h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Days after resolution during which citizen can dispute or
                reopen.
              </p>
            </div>

            {/* Policy Active Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="sla-active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
                disabled={isSubmitting}
              />
              <label
                htmlFor="sla-active"
                className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>
                  Enforce active automated SLA tracking for this category
                </span>
              </label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  isSubmitting || responseHours <= 0 || resolutionHours <= 0
                }
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="size-3.5" />
                    <span>Saving Policy...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save SLA Policy</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
