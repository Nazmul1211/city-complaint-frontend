"use client";

import {
  Edit,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useCreateWard,
  useDeleteWard,
  useGetWards,
  useUpdateWard,
} from "@/hooks";
import type { Ward } from "@/types";

export function WardTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<Ward | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [isActive, setIsActive] = useState(true);

  const {
    data: wardsResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useGetWards();

  const { mutateAsync: createWard, isPending: isCreating } = useCreateWard();
  const { mutateAsync: updateWard, isPending: isUpdating } = useUpdateWard();
  const { mutateAsync: deleteWard, isPending: isDeleting } = useDeleteWard();

  const isSubmitting = isCreating || isUpdating;

  const wards: Ward[] = useMemo(() => {
    return wardsResponse?.data || [];
  }, [wardsResponse]);

  const filteredWards = useMemo(() => {
    if (!searchTerm.trim()) return wards;
    const q = searchTerm.toLowerCase();
    return wards.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        Boolean(w.code?.toLowerCase().includes(q)) ||
        w.city.toLowerCase().includes(q) ||
        Boolean(w.wardNumber?.toLowerCase().includes(q)),
    );
  }, [wards, searchTerm]);

  useEffect(() => {
    if (isDialogOpen) {
      if (editingWard) {
        setName(editingWard.name || "");
        setCode(editingWard.code || "");
        setCity(editingWard.city || "Dhaka");
        setIsActive(editingWard.isActive ?? true);
      } else {
        setName("");
        setCode("");
        setCity("Dhaka");
        setIsActive(true);
      }
    }
  }, [isDialogOpen, editingWard]);

  const handleOpenCreate = () => {
    setEditingWard(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (ward: Ward) => {
    setEditingWard(ward);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !city.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Ward name, code, and city are required.",
      });
      return;
    }

    try {
      if (editingWard) {
        await updateWard({
          id: editingWard.id,
          payload: {
            name: name.trim(),
            code: code.trim().toUpperCase(),
            city: city.trim(),
            isActive,
          },
        });
        toast.add({
          title: "Ward Updated",
          description: `Ward ${name} updated successfully.`,
        });
      } else {
        await createWard({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          city: city.trim(),
          isActive,
        });
        toast.add({
          title: "Ward Registered",
          description: `Ward ${name} (${city}) registered successfully.`,
        });
      }

      setIsDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save ward";
      toast.add({
        title: "Save Failed",
        description: errorMsg,
      });
    }
  };

  const handleDelete = async (ward: Ward) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate ward "${ward.name}" (${ward.city})?`,
      )
    ) {
      return;
    }

    try {
      await deleteWard(ward.id);
      toast.add({
        title: "Ward Removed",
        description: `Ward "${ward.name}" was removed successfully.`,
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete ward";
      toast.add({
        title: "Delete Failed",
        description: errorMsg,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search wards by name, code or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="gap-1.5 h-9"
            >
              <RefreshCw
                className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="gap-1.5 h-9 bg-primary text-primary-foreground"
            >
              <Plus className="size-4" />
              <span>Add Ward</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ward Data Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>Municipal Geographic Wards</span>
              <span className="text-xs font-normal text-muted-foreground">
                ({filteredWards.length} wards)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] text-xs">
                    Ward Designation
                  </TableHead>
                  <TableHead className="w-[120px] text-xs">Ward Code</TableHead>
                  <TableHead className="w-[150px] text-xs">
                    Municipality / City
                  </TableHead>
                  <TableHead className="w-[110px] text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk-w1", "sk-w2", "sk-w3", "sk-w4"].map((rowKey) => (
                    <TableRow key={rowKey}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-md" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-7 w-16 ml-auto rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredWards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <MapPin className="size-8 stroke-1 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                          No municipal wards found
                        </p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={handleOpenCreate}
                          className="mt-1"
                        >
                          Register new ward
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWards.map((ward) => (
                    <TableRow
                      key={ward.id}
                      className="hover:bg-muted/40 text-xs"
                    >
                      {/* Name */}
                      <TableCell className="font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-3.5 text-primary" />
                          <span>{ward.name}</span>
                          {ward.wardNumber && (
                            <span className="text-muted-foreground font-normal">
                              (Ward #{ward.wardNumber})
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Code */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-[11px]"
                        >
                          {ward.code || "W-REG"}
                        </Badge>
                      </TableCell>

                      {/* City */}
                      <TableCell className="text-foreground">
                        {ward.city}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={ward.isActive ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {ward.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleOpenEdit(ward)}
                            title="Edit ward"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDelete(ward)}
                            disabled={isDeleting}
                            title="Deactivate ward"
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

      {/* Ward Create/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && setIsDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  {editingWard ? "Edit Municipal Ward" : "Register New Ward"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {editingWard
                    ? "Update geographic boundaries and ward identifiers"
                    : "Add an electoral or administrative ward to the municipal map"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label
                htmlFor="ward-name"
                className="text-xs font-medium text-foreground"
              >
                Ward Designation / Name *
              </label>
              <Input
                id="ward-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ward 19 - Banani / Gulshan North"
                required
                disabled={isSubmitting}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="ward-code"
                  className="text-xs font-medium text-foreground"
                >
                  Ward Code *
                </label>
                <Input
                  id="ward-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. W19"
                  required
                  disabled={isSubmitting}
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ward-city"
                  className="text-xs font-medium text-foreground"
                >
                  City / Jurisdiction *
                </label>
                <Input
                  id="ward-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka"
                  required
                  disabled={isSubmitting}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="ward-active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
                disabled={isSubmitting}
              />
              <label
                htmlFor="ward-active"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Ward is actively populated & accepting complaints
              </label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
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
                <Save className="size-3.5" />
                <span>{editingWard ? "Save Changes" : "Register Ward"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
