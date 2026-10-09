"use client";

import {
  Building2,
  Clock,
  Coins,
  Edit,
  FolderKanban,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CategoryFormDialog,
  SlaPolicyDialog,
} from "@/components/modules/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import {
  useDeleteCategory,
  useGetCategories,
  useGetDepartments,
} from "@/hooks";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("ALL");

  // Dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSlaDialogOpen, setIsSlaDialogOpen] = useState(false);
  const [slaTargetCategory, setSlaTargetCategory] = useState<Category | null>(
    null,
  );

  const { data: departmentsResponse } = useGetDepartments();
  const departments = departmentsResponse?.data || [];

  const {
    data: categoriesResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useGetCategories(selectedDeptId !== "ALL" ? selectedDeptId : undefined);
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const categories: Category[] = useMemo(() => {
    return categoriesResponse?.data || [];
  }, [categoriesResponse]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const q = searchTerm.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        Boolean(c.description?.toLowerCase().includes(q)) ||
        Boolean(c.department?.name?.toLowerCase().includes(q)),
    );
  }, [categories, searchTerm]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleOpenSla = (category: Category) => {
    setSlaTargetCategory(category);
    setIsSlaDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${category.name}"? Citizen complaints under this category will no longer be acceptible.`,
      )
    ) {
      return;
    }

    try {
      await deleteCategory(category.id);
      toast.add({
        title: "Category Deleted",
        description: `Service category "${category.name}" has been removed.`,
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete category";
      toast.add({
        title: "Deletion Failed",
        description: errorMsg,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Categories & SLA Policies
            </h1>
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary"
            >
              <FolderKanban className="size-3 text-primary" />
              Taxonomy & Compliance
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage complaint classifications, permit charges, and statutory
            turnaround timelines per municipal issue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5"
          >
            <RefreshCw
              className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 bg-primary text-primary-foreground"
          >
            <Plus className="size-4" />
            <span>New Category</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search categories by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>

            <div className="w-full sm:w-56">
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                aria-label="Filter by department"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedDeptId !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDeptId("ALL");
                }}
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground self-end sm:self-center">
            <span className="font-medium text-foreground">
              {filteredCategories.length}
            </span>{" "}
            categories listed
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Issue Taxonomy & Governance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] text-xs">
                    Category Name
                  </TableHead>
                  <TableHead className="w-[180px] text-xs">
                    Department
                  </TableHead>
                  <TableHead className="w-[130px] text-xs">
                    Permit / Fee
                  </TableHead>
                  <TableHead className="text-xs">
                    Statutory SLA Window
                  </TableHead>
                  <TableHead className="w-[90px] text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk-c1", "sk-c2", "sk-c3", "sk-c4"].map((rowKey) => (
                    <TableRow key={rowKey}>
                      <TableCell>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-40 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-14 rounded-md" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-7 w-24 ml-auto rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <FolderKanban className="size-8 stroke-1 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                          No service categories found for this selection
                        </p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={handleOpenCreate}
                          className="mt-1"
                        >
                          Create first category
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => {
                    const dept =
                      cat.department ||
                      departments.find((d) => d.id === cat.departmentId);

                    return (
                      <TableRow
                        key={cat.id}
                        className="hover:bg-muted/40 text-xs"
                      >
                        {/* Name & Description */}
                        <TableCell className="font-semibold text-foreground">
                          <div className="truncate">{cat.name}</div>
                          {cat.description && (
                            <p className="text-[11px] text-muted-foreground font-normal line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          )}
                        </TableCell>

                        {/* Department */}
                        <TableCell>
                          {dept ? (
                            <Badge
                              variant="secondary"
                              className="font-medium text-[11px] gap-1 max-w-[170px] truncate"
                            >
                              <Building2 className="size-3 shrink-0" />
                              <span className="truncate">{dept.name}</span>
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground italic text-[11px]">
                              Unassigned
                            </span>
                          )}
                        </TableCell>

                        {/* Fee requirement */}
                        <TableCell>
                          {cat.paymentRequired ? (
                            <Badge
                              variant="outline"
                              className="font-mono text-[11px] gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
                            >
                              <Coins className="size-3" />
                              <span>
                                {cat.defaultFeeAmount} {cat.currency || "BDT"}
                              </span>
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-[11px]">
                              Standard / Free
                            </span>
                          )}
                        </TableCell>

                        {/* SLA Policy Display */}
                        <TableCell>
                          {cat.slaPolicy ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5"
                              >
                                <Clock className="size-2.5" />
                                <span>
                                  Resp:{" "}
                                  {cat.slaPolicy.responseWithinHours ??
                                    cat.slaPolicy.responseHours ??
                                    24}
                                  h
                                </span>
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                              >
                                <ShieldCheck className="size-2.5" />
                                <span>
                                  Resolve:{" "}
                                  {cat.slaPolicy.resolutionWithinHours ??
                                    cat.slaPolicy.resolutionHours ??
                                    48}
                                  h
                                </span>
                              </Badge>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenSla(cat)}
                              className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              <Clock className="size-3" />
                              <span>Click to configure SLA policy</span>
                            </button>
                          )}
                        </TableCell>

                        {/* Active Status */}
                        <TableCell>
                          <Badge
                            variant={cat.isActive ? "success" : "secondary"}
                            className="text-[10px]"
                          >
                            {cat.isActive ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => handleOpenSla(cat)}
                              className="gap-1 text-[11px] h-7"
                              title="Configure statutory SLA policy"
                            >
                              <Clock className="size-3 text-amber-600" />
                              <span className="hidden sm:inline">SLA</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleOpenEdit(cat)}
                              title="Edit category"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleDelete(cat)}
                              disabled={isDeleting}
                              title="Delete category"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        category={editingCategory}
        defaultDepartmentId={
          selectedDeptId !== "ALL" ? selectedDeptId : undefined
        }
        onSuccess={() => refetch()}
      />

      {/* SLA Policy Dialog */}
      <SlaPolicyDialog
        isOpen={isSlaDialogOpen}
        onClose={() => setIsSlaDialogOpen(false)}
        category={slaTargetCategory}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
