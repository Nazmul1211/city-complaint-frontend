"use client";

import {
  AlertTriangle,
  Building2,
  Calendar,
  Eye,
  Filter,
  Layers,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AssignStaffModal,
  RouteDepartmentModal,
} from "@/components/modules/admin";
import { PriorityTag } from "@/components/modules/staff/priority-tag";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDebounce, useGetAllRequests, useGetDepartments } from "@/hooks";
import type { RequestPriority, RequestStatus, ServiceRequest } from "@/types";

export default function AdminRequestsDispatchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Active modal state
  const [routeModalRequest, setRouteModalRequest] =
    useState<ServiceRequest | null>(null);
  const [assignModalRequest, setAssignModalRequest] =
    useState<ServiceRequest | null>(null);

  // Queries
  const { data: departmentsResponse } = useGetDepartments();
  const departments = departmentsResponse?.data || [];

  const {
    data: requestsResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useGetAllRequests({
    page: currentPage,
    limit: 100, // Client side filtering for rich real-time triage experience
    searchTerm: debouncedSearch || undefined,
    status:
      selectedStatus !== "ALL" ? (selectedStatus as RequestStatus) : undefined,
    priority:
      selectedPriority !== "ALL"
        ? (selectedPriority as RequestPriority)
        : undefined,
  });

  const rawRequests = useMemo(() => {
    return requestsResponse?.data || [];
  }, [requestsResponse]);

  // Filter requests by department and client search if needed
  const filteredRequests = useMemo(() => {
    let list = rawRequests;

    if (selectedDeptId !== "ALL") {
      list = list.filter(
        (r) =>
          r.currentDepartmentId === selectedDeptId ||
          r.category?.departmentId === selectedDeptId,
      );
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.requestNo.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          Boolean(r.citizen?.name?.toLowerCase().includes(q)) ||
          Boolean(r.addressLine?.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [rawRequests, selectedDeptId, debouncedSearch]);

  // Paginated slice
  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage]);

  // Quick triage counter metrics
  const triageMetrics = useMemo(() => {
    const unrouted = rawRequests.filter((r) => !r.currentDepartmentId).length;
    const unassigned = rawRequests.filter(
      (r) => r.status === "SUBMITTED" || r.status === "UNDER_REVIEW",
    ).length;
    const urgent = rawRequests.filter((r) => r.priority === "URGENT").length;
    return {
      total: rawRequests.length,
      unrouted,
      unassigned,
      urgent,
    };
  }, [rawRequests]);

  const hasActiveFilters =
    selectedStatus !== "ALL" ||
    selectedPriority !== "ALL" ||
    selectedDeptId !== "ALL" ||
    searchTerm.trim().length > 0;

  const resetFilters = () => {
    setSelectedStatus("ALL");
    setSelectedPriority("ALL");
    setSelectedDeptId("ALL");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Administrative Triage & Dispatch
            </h1>
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary"
            >
              <Layers className="size-3 text-primary" />
              Dispatch Queue
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Route incoming citizen issues to municipal departments, assign field
            technicians, and monitor SLA response deadlines.
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
            <span>Refresh Queue</span>
          </Button>
        </div>
      </div>

      {/* Quick Status Pill Counters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-3.5 rounded-lg border bg-card flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">
              Total In Queue
            </div>
            <div className="text-xl font-bold text-foreground">
              {triageMetrics.total}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Layers className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-lg border bg-card flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">
              Awaiting Assignment
            </div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {triageMetrics.unassigned}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <UserX className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-lg border bg-card flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">
              Urgent Emergencies
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {triageMetrics.urgent}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-lg border bg-card flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium">
              Unrouted Casework
            </div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {triageMetrics.unrouted}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Building2 className="size-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by request #, title, citizen, address..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 text-xs h-9"
              />
            </div>

            {/* Department Filter */}
            <div className="w-full md:w-52">
              <select
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Municipal Department"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-44">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Request Status"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="PENDING">PENDING</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="w-full md:w-36">
              <select
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Request Priority"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Dispatch Data Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter className="size-4 text-primary" />
              <span>Complaints Dispatch Queue</span>
              <span className="text-xs font-normal text-muted-foreground">
                ({filteredRequests.length} results)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px] text-xs">
                    Request Ref
                  </TableHead>
                  <TableHead className="text-xs">Issue & Location</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Priority</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">SLA Target</TableHead>
                  <TableHead className="text-right text-xs">
                    Dispatch Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk-r1", "sk-r2", "sk-r3", "sk-r4", "sk-r5"].map(
                    (rowKey) => (
                      <TableRow key={rowKey}>
                        <TableCell>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-48 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-20 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-7 w-28 ml-auto rounded-md" />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : paginatedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Layers className="size-8 stroke-1 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                          No complaints match your active dispatch filters
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={resetFilters}
                            className="mt-1"
                          >
                            Clear active filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRequests.map((req) => {
                    const currentDept =
                      req.currentDepartment ||
                      departments.find(
                        (d) =>
                          d.id === req.currentDepartmentId ||
                          d.id === req.category?.departmentId,
                      );

                    return (
                      <TableRow
                        key={req.id}
                        className="hover:bg-muted/40 text-xs"
                      >
                        {/* Request No & Date */}
                        <TableCell className="font-medium">
                          <Link
                            href={`/dashboard/requests/${req.id}`}
                            className="font-mono text-primary font-semibold hover:underline block"
                          >
                            {req.requestNo}
                          </Link>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                            <Calendar className="size-3" />
                            <span>
                              {new Date(req.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </TableCell>

                        {/* Title & Location */}
                        <TableCell className="max-w-[260px]">
                          <div className="font-semibold text-foreground truncate">
                            {req.title}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate mt-0.5">
                            <MapPin className="size-3 shrink-0 text-muted-foreground/70" />
                            <span className="truncate">
                              {req.addressLine}
                              {req.ward?.wardNumber &&
                                ` (Ward ${req.ward.wardNumber})`}
                            </span>
                          </div>
                        </TableCell>

                        {/* Department */}
                        <TableCell>
                          {currentDept ? (
                            <Badge
                              variant="secondary"
                              className="font-medium text-[11px] gap-1 max-w-[160px] truncate"
                            >
                              <Building2 className="size-3 shrink-0" />
                              <span className="truncate">
                                {currentDept.name}
                              </span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/5 gap-1"
                            >
                              <AlertTriangle className="size-2.5" />
                              Unrouted
                            </Badge>
                          )}
                        </TableCell>

                        {/* Priority */}
                        <TableCell>
                          <PriorityTag priority={req.priority} />
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={req.status} />
                        </TableCell>

                        {/* SLA Resolution Due */}
                        <TableCell className="text-[11px]">
                          {req.resolutionDueAt ? (
                            <span className="text-foreground font-mono">
                              {new Date(req.resolutionDueAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Standard (48h)
                            </span>
                          )}
                        </TableCell>

                        {/* Dispatch Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Route Department Button */}
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setRouteModalRequest(req)}
                              className="gap-1 text-[11px] h-7"
                              title="Route complaint to a department"
                            >
                              <Navigation className="size-3 text-blue-600" />
                              <span className="hidden sm:inline">Route</span>
                            </Button>

                            {/* Assign Staff Button */}
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setAssignModalRequest(req)}
                              className="gap-1 text-[11px] h-7"
                              title="Assign field technician"
                            >
                              <UserCheck className="size-3 text-emerald-600" />
                              <span className="hidden sm:inline">Assign</span>
                            </Button>

                            {/* View Full Case Link */}
                            <Link
                              href={`/dashboard/requests/${req.id}`}
                              className={buttonVariants({
                                variant: "ghost",
                                size: "icon-xs",
                                className:
                                  "text-muted-foreground hover:text-foreground",
                              })}
                              title="View full case file"
                            >
                              <Eye className="size-3.5" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Pagination */}
          <div className="p-3 border-t bg-muted/20">
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Route Department Modal */}
      <RouteDepartmentModal
        isOpen={!!routeModalRequest}
        onClose={() => setRouteModalRequest(null)}
        request={routeModalRequest}
        onSuccess={() => refetch()}
      />

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={!!assignModalRequest}
        onClose={() => setAssignModalRequest(null)}
        request={assignModalRequest}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
