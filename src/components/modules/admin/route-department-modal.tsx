"use client";

import { Navigation, Send } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useGetDepartments, useRouteToDepartment } from "@/hooks";
import type { Department, ServiceRequest } from "@/types";

interface RouteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  onSuccess?: () => void;
}

export function RouteDepartmentModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: RouteDepartmentModalProps) {
  const { data: departmentsResponse, isLoading: isLoadingDepts } =
    useGetDepartments();
  const { mutateAsync: routeDepartment, isPending } = useRouteToDepartment();

  const departments: Department[] = departmentsResponse?.data || [];

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    if (isOpen && request) {
      setSelectedDepartmentId(
        request.currentDepartmentId || request.category?.departmentId || "",
      );
      setReason("");
    }
  }, [isOpen, request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !selectedDepartmentId) {
      toast.add({
        title: "Department Required",
        description: "Please select a target department",
      });
      return;
    }

    try {
      await routeDepartment({
        requestId: request.id,
        payload: {
          departmentId: selectedDepartmentId,
          reason: reason.trim() || undefined,
        },
      });

      const targetDept = departments.find((d) => d.id === selectedDepartmentId);
      toast.add({
        title: "Department Routed",
        description: `Routed complaint ${request.requestNo} to ${targetDept?.name || "department"}`,
      });
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to route request";
      toast.add({
        title: "Routing Failed",
        description: errorMsg,
      });
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Navigation className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Route Complaint to Department
              </DialogTitle>
              <DialogDescription className="text-xs">
                Assign casework jurisdiction to the relevant municipal bureau
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Request Quick Summary */}
          <div className="p-3 rounded-lg border bg-muted/40 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                {request.requestNo}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {request.priority} Priority
              </Badge>
            </div>
            <p className="text-muted-foreground line-clamp-1 font-medium">
              {request.title}
            </p>
            {request.currentDepartment && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                <span>Current Department:</span>
                <span className="font-semibold text-foreground">
                  {request.currentDepartment.name}
                </span>
              </div>
            )}
          </div>

          {/* Department Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="department-select"
              className="text-xs font-medium text-foreground flex items-center justify-between"
            >
              <span>Target Municipal Department *</span>
              {isLoadingDepts && <Spinner className="size-3 text-primary" />}
            </label>
            <select
              id="department-select"
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              disabled={isPending || isLoadingDepts}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="" disabled>
                Select destination department...
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Routing Reason / Instructions Memo */}
          <div className="space-y-1.5">
            <label
              htmlFor="route-reason"
              className="text-xs font-medium text-foreground"
            >
              Routing Memo / Transfer Reason (Optional)
            </label>
            <Textarea
              id="route-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Cross-cutting utility issue requiring water and sanitation engineering team..."
              rows={3}
              maxLength={500}
              disabled={isPending}
              className="text-xs resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {reason.length}/500 characters
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !selectedDepartmentId}
              className="gap-1.5 bg-primary text-primary-foreground"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Routing...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Confirm Department Route</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
