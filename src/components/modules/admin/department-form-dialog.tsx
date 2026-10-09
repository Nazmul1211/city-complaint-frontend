"use client";

import { Building2, Save } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateDepartment, useUpdateDepartment } from "@/hooks";
import type { Department } from "@/types";

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department | null;
  onSuccess?: () => void;
}

export function DepartmentFormDialog({
  isOpen,
  onClose,
  department,
  onSuccess,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;
  const { mutateAsync: createDept, isPending: isCreating } =
    useCreateDepartment();
  const { mutateAsync: updateDept, isPending: isUpdating } =
    useUpdateDepartment();
  const isSubmitting = isCreating || isUpdating;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (department) {
        setName(department.name || "");
        setCode(department.code || "");
        setDescription(department.description || "");
        setIsActive(department.isActive ?? true);
      } else {
        setName("");
        setCode("");
        setDescription("");
        setIsActive(true);
      }
    }
  }, [isOpen, department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Department name and code are required.",
      });
      return;
    }

    try {
      if (isEditing && department) {
        await updateDept({
          id: department.id,
          payload: {
            name: name.trim(),
            code: code.trim().toUpperCase(),
            description: description.trim() || null,
            isActive,
          },
        });
        toast.add({
          title: "Department Updated",
          description: `Municipal department "${name}" updated successfully.`,
        });
      } else {
        await createDept({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim() || undefined,
          isActive,
        });
        toast.add({
          title: "Department Created",
          description: `New municipal department "${name}" has been established.`,
        });
      }

      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save department";
      toast.add({
        title: "Action Failed",
        description: errorMsg,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                {isEditing
                  ? "Edit Municipal Department"
                  : "New Municipal Department"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing
                  ? "Update bureau specifications and operational routing parameters"
                  : "Establish a municipal agency responsible for civic issues"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Department Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="dept-name"
              className="text-xs font-medium text-foreground"
            >
              Department Name *
            </label>
            <Input
              id="dept-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Roads & Infrastructure Management"
              required
              disabled={isSubmitting}
              className="text-xs h-9"
            />
          </div>

          {/* Department Code */}
          <div className="space-y-1.5">
            <label
              htmlFor="dept-code"
              className="text-xs font-medium text-foreground"
            >
              Unique Code * (uppercase tag)
            </label>
            <Input
              id="dept-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ROADS, WATER, ELEC"
              required
              disabled={isSubmitting}
              className="text-xs h-9 font-mono"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="dept-desc"
              className="text-xs font-medium text-foreground"
            >
              Mandate / Description (Optional)
            </label>
            <Textarea
              id="dept-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Responsible for arterial highways, drainage repairs, and asphalt resurfacing..."
              rows={3}
              disabled={isSubmitting}
              className="text-xs resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="dept-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="dept-active"
              className="text-xs font-medium text-foreground cursor-pointer"
            >
              Department is actively operating & available for routing
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
              disabled={isSubmitting || !name.trim() || !code.trim()}
              className="gap-1.5 bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>
                    {isEditing ? "Save Changes" : "Create Department"}
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
