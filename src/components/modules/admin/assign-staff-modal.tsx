"use client";

import { Check, Search, UserCheck, Users, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useAssignStaffMember, useGetUsers } from "@/hooks";
import { cn } from "@/lib/utils";
import type { ServiceRequest, User } from "@/types";

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  onSuccess?: () => void;
}

export function AssignStaffModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: AssignStaffModalProps) {
  const [filterAllDepts, setFilterAllDepts] = useState<boolean>(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [dispatchNote, setDispatchNote] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const targetDepartmentId =
    request?.currentDepartmentId || request?.category?.departmentId;

  // Query staff members scoped to the complaint's active department, or all if toggled
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsers({
    role: "STAFF",
    departmentId: filterAllDepts ? undefined : targetDepartmentId,
    status: "ACTIVE",
    limit: 50,
  });

  const { mutateAsync: assignStaff, isPending } = useAssignStaffMember();

  const staffMembers: User[] = useMemo(() => {
    return usersResponse?.data || [];
  }, [usersResponse]);

  // Filter staff by search query
  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staffMembers;
    const q = searchQuery.toLowerCase();
    return staffMembers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        Boolean(s.phone?.toLowerCase().includes(q)),
    );
  }, [staffMembers, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setSelectedStaffId("");
      setDispatchNote("");
      setSearchQuery("");
      setFilterAllDepts(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !selectedStaffId) {
      toast.add({
        title: "Technician Required",
        description: "Please select a technician to assign",
      });
      return;
    }

    try {
      await assignStaff({
        requestId: request.id,
        payload: {
          assigneeId: selectedStaffId,
          note: dispatchNote.trim() || undefined,
        },
      });

      const assignedUser = staffMembers.find((s) => s.id === selectedStaffId);
      toast.add({
        title: "Staff Assigned",
        description: `Assigned ${request.requestNo} to technician ${assignedUser?.name || "staff"}`,
      });
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to assign staff technician";
      toast.add({
        title: "Assignment Failed",
        description: errorMsg,
      });
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Assign Staff Field Technician
              </DialogTitle>
              <DialogDescription className="text-xs">
                Dispatch an active municipal technician to investigate and
                resolve this complaint
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 overflow-hidden pt-1"
        >
          {/* Request Quick Summary */}
          <div className="p-3 rounded-lg border bg-muted/40 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                {request.requestNo}
              </span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px]">
                  {request.priority} Priority
                </Badge>
                {request.currentDepartment && (
                  <Badge variant="secondary" className="text-[10px]">
                    {request.currentDepartment.name}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-1 font-medium">
              {request.title}
            </p>
          </div>

          {/* Search & Department Scope Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Select Technician *
              </span>
              <button
                type="button"
                onClick={() => setFilterAllDepts((prev) => !prev)}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                {filterAllDepts
                  ? "Showing All Departments (Click to filter by Dept)"
                  : "Filter: Department Only (Click to show All)"}
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Staff List Selection Container */}
          <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto rounded-lg border divide-y bg-background">
            {isLoadingUsers ? (
              <div className="flex flex-col items-center justify-center p-6 gap-2 text-xs text-muted-foreground">
                <Spinner className="size-4 text-primary" />
                <span>Loading available technicians...</span>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground space-y-2">
                <Users className="size-6 text-muted-foreground/50" />
                <p>No active technicians found for this department.</p>
                {!filterAllDepts && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setFilterAllDepts(true)}
                  >
                    View technicians across all departments
                  </Button>
                )}
              </div>
            ) : (
              filteredStaff.map((staff) => {
                const isSelected = selectedStaffId === staff.id;
                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={cn(
                      "w-full text-left p-2.5 transition-colors flex items-center justify-between gap-3 text-xs",
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/50 text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "size-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {staff.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {staff.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Wrench className="size-2.5" />
                        Technician
                      </Badge>
                      {isSelected && (
                        <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="size-2.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Dispatch Work Order Notes */}
          <div className="space-y-1.5">
            <label
              htmlFor="dispatch-note"
              className="text-xs font-medium text-foreground"
            >
              Work Order Instructions / Dispatch Note (Optional)
            </label>
            <Textarea
              id="dispatch-note"
              value={dispatchNote}
              onChange={(e) => setDispatchNote(e.target.value)}
              placeholder="e.g., Priority inspect site today. Contact resident before arrival..."
              rows={2}
              maxLength={500}
              disabled={isPending}
              className="text-xs resize-none"
            />
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
              disabled={isPending || !selectedStaffId}
              className="gap-1.5 bg-primary text-primary-foreground"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5" />
                  <span>Confirm Staff Assignment</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
