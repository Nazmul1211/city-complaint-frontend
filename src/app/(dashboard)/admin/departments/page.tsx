"use client";

import {
  Building2,
  Edit,
  FolderKanban,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DepartmentFormDialog } from "@/components/modules/admin";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useDeleteDepartment, useGetDepartments } from "@/hooks";
import type { Department } from "@/types";

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const {
    data: departmentsResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useGetDepartments();
  const { mutateAsync: deleteDept, isPending: isDeleting } =
    useDeleteDepartment();

  const departments: Department[] = useMemo(() => {
    return departmentsResponse?.data || [];
  }, [departmentsResponse]);

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;
    const q = searchTerm.toLowerCase();
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        Boolean(d.description?.toLowerCase().includes(q)),
    );
  }, [departments, searchTerm]);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setIsDialogOpen(true);
  };

  const handleDelete = async (dept: Department) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate and remove department "${dept.name}"? This action affects all linked categories.`,
      )
    ) {
      return;
    }

    try {
      await deleteDept(dept.id);
      toast.add({
        title: "Department Removed",
        description: `Department "${dept.name}" was deactivated successfully.`,
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete department";
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
              Municipal Departments
            </h1>
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary"
            >
              <Building2 className="size-3 text-primary" />
              Administrative Bureau Registry
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure civic infrastructure entities, operational codes, and
            casework routing destinations.
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
            <span>New Department</span>
          </Button>
        </div>
      </div>

      {/* Filter and Overview Card */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search departments by name, code or mandate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredDepartments.length}
            </span>{" "}
            bureau(s) registered
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Municipal Department Roster</span>
            <Link
              href="/admin/categories"
              className={buttonVariants({
                variant: "outline",
                size: "xs",
                className: "gap-1 text-[11px]",
              })}
            >
              <FolderKanban className="size-3" />
              <span>Manage Service Categories</span>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[220px] text-xs">
                    Department Name
                  </TableHead>
                  <TableHead className="w-[100px] text-xs">
                    Bureau Code
                  </TableHead>
                  <TableHead className="text-xs">Mandate / Scope</TableHead>
                  <TableHead className="w-[110px] text-xs">
                    Technicians
                  </TableHead>
                  <TableHead className="w-[100px] text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk-d1", "sk-d2", "sk-d3", "sk-d4"].map((rowKey) => (
                    <TableRow key={rowKey}>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-64" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-md" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-7 w-20 ml-auto rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Building2 className="size-8 stroke-1 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                          No municipal departments found
                        </p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={handleOpenCreate}
                          className="mt-1"
                        >
                          Establish first department
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((dept) => (
                    <TableRow
                      key={dept.id}
                      className="hover:bg-muted/40 text-xs"
                    >
                      {/* Name */}
                      <TableCell className="font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <Building2 className="size-3.5" />
                          </div>
                          <span>{dept.name}</span>
                        </div>
                      </TableCell>

                      {/* Code */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-[11px]"
                        >
                          {dept.code}
                        </Badge>
                      </TableCell>

                      {/* Mandate */}
                      <TableCell className="max-w-[320px]">
                        <p className="text-muted-foreground line-clamp-2">
                          {dept.description ||
                            "General municipal engineering and casework."}
                        </p>
                      </TableCell>

                      {/* Technicians count */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="size-3.5" />
                          <span>{dept._count?.members || 0} active</span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={dept.isActive ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {dept.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleOpenEdit(dept)}
                            title="Edit department"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDelete(dept)}
                            disabled={isDeleting}
                            title="Deactivate department"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Department Form Dialog */}
      <DepartmentFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        department={editingDept}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
