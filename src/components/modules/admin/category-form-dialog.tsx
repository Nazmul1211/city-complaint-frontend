"use client";

import { FolderKanban, Save } from "lucide-react";
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
import {
  useCreateCategory,
  useGetDepartments,
  useUpdateCategory,
} from "@/hooks";
import type { Category, Department } from "@/types";

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  defaultDepartmentId?: string;
  onSuccess?: () => void;
}

export function CategoryFormDialog({
  isOpen,
  onClose,
  category,
  defaultDepartmentId,
  onSuccess,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const { data: deptsResponse, isLoading: isLoadingDepts } =
    useGetDepartments();
  const departments: Department[] = deptsResponse?.data || [];

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory();
  const isSubmitting = isCreating || isUpdating;

  const [departmentId, setDepartmentId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [defaultFeeAmount, setDefaultFeeAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState("BDT");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setDepartmentId(category.departmentId || "");
        setName(category.name || "");
        setDescription(category.description || "");
        setPaymentRequired(category.paymentRequired ?? false);
        setDefaultFeeAmount(
          category.defaultFeeAmount ? Number(category.defaultFeeAmount) : "",
        );
        setCurrency(category.currency || "BDT");
        setIsActive(category.isActive ?? true);
      } else {
        setDepartmentId(defaultDepartmentId || "");
        setName("");
        setDescription("");
        setPaymentRequired(false);
        setDefaultFeeAmount("");
        setCurrency("BDT");
        setIsActive(true);
      }
    }
  }, [isOpen, category, defaultDepartmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !departmentId) {
      toast.add({
        title: "Validation Error",
        description: "Department and category name are required.",
      });
      return;
    }

    try {
      if (isEditing && category) {
        await updateCategory({
          id: category.id,
          payload: {
            name: name.trim(),
            description: description.trim() || null,
            paymentRequired,
            defaultFeeAmount:
              paymentRequired && defaultFeeAmount !== ""
                ? Number(defaultFeeAmount)
                : null,
            currency: paymentRequired ? currency : undefined,
            isActive,
          },
        });
        toast.add({
          title: "Category Updated",
          description: `Service category "${name}" updated successfully.`,
        });
      } else {
        await createCategory({
          departmentId,
          name: name.trim(),
          description: description.trim() || undefined,
          paymentRequired,
          defaultFeeAmount:
            paymentRequired && defaultFeeAmount !== ""
              ? Number(defaultFeeAmount)
              : undefined,
          currency: paymentRequired ? currency : "BDT",
          isActive,
        });
        toast.add({
          title: "Category Created",
          description: `New service category "${name}" added to department.`,
        });
      }

      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save category";
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
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                {isEditing ? "Edit Service Category" : "New Service Category"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing
                  ? "Update category taxonomy, fee criteria and department assignment"
                  : "Create an issue category under a municipal department"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Department Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="cat-dept"
              className="text-xs font-medium text-foreground flex items-center justify-between"
            >
              <span>Municipal Department *</span>
              {isLoadingDepts && <Spinner className="size-3 text-primary" />}
            </label>
            <select
              id="cat-dept"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={isSubmitting || (isEditing && !!category?.departmentId)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="" disabled>
                Select owning department...
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Category Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="cat-name"
              className="text-xs font-medium text-foreground"
            >
              Category Name *
            </label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pothole & Road Cave-in, Water Pipe Leakage"
              required
              disabled={isSubmitting}
              className="text-xs h-9"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="cat-desc"
              className="text-xs font-medium text-foreground"
            >
              Description (Optional)
            </label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Issues concerning public asphalt damage, sidewalk cave-ins..."
              rows={2}
              disabled={isSubmitting}
              className="text-xs resize-none"
            />
          </div>

          {/* Payment Requirement Toggle & Fee Field */}
          <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <Checkbox
                id="cat-payment"
                checked={paymentRequired}
                onCheckedChange={(checked) =>
                  setPaymentRequired(checked === true)
                }
                disabled={isSubmitting}
              />
              <label
                htmlFor="cat-payment"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Requires Municipal Service Fee / Permit Charge
              </label>
            </div>

            {paymentRequired && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
                <div className="space-y-1">
                  <label
                    htmlFor="cat-fee"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    Standard Fee Amount
                  </label>
                  <Input
                    id="cat-fee"
                    type="number"
                    min="0"
                    step="50"
                    value={defaultFeeAmount}
                    onChange={(e) =>
                      setDefaultFeeAmount(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 500"
                    disabled={isSubmitting}
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="cat-curr"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    Currency
                  </label>
                  <Input
                    id="cat-curr"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    disabled={isSubmitting}
                    className="text-xs h-8 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="cat-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="cat-active"
              className="text-xs font-medium text-foreground cursor-pointer"
            >
              Category is active for citizen complaints
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
              disabled={isSubmitting || !name.trim() || !departmentId}
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
                  <span>{isEditing ? "Save Changes" : "Create Category"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
