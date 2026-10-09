"use client";

import {
  AlertTriangle,
  ArrowUpDown,
  HardHat,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { StaffRequestsTable } from "@/components/modules/staff/staff-requests-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce, useGetAllRequests, useGetCategories } from "@/hooks";
import StaffAssignedLoading from "./loading";

const STATUS_TABS: [string, string][] = [
  ["ALL", "All"],
  ["ASSIGNED", "Assigned"],
  ["IN_PROGRESS", "In Progress"],
  ["PENDING", "Pending"],
  ["RESOLVED", "Resolved"],
  ["CLOSED", "Closed"],
];

const PRIORITY_OPTIONS: [string, string][] = [
  ["ALL", "All Priorities"],
  ["URGENT", "Urgent Priority"],
  ["HIGH", "High Priority"],
  ["MEDIUM", "Medium Priority"],
  ["LOW", "Low Priority"],
];

const SORT_OPTIONS: [string, string][] = [
  ["createdAt:desc", "Newest Filed"],
  ["createdAt:asc", "Oldest Filed"],
  ["urgency:desc", "Highest Urgency / Priority"],
  ["sla:asc", "SLA Expiry (Earliest Due)"],
];

const PRIORITY_WEIGHT: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function StaffAssignedContent() {
  const searchParams = useSearchParams();

  // Read initial filter values from URL params
  const initialPriority = searchParams.get("priority") || "ALL";
  const initialStatus = searchParams.get("status") || "ALL";

  const [statusTab, setStatusTab] = useState<string>(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState<string>(initialPriority);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<string>("createdAt:desc");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Parse sort configuration
  const [sortByField, sortOrderField] = sortOption.split(":") as [
    string,
    "asc" | "desc",
  ];

  // Fetch categories for the category filter dropdown
  const { data: categoriesData } = useGetCategories();
  const categories = categoriesData?.data ?? [];

  // Query requests
  const queryParams = {
    page,
    limit: 20,
    ...(statusTab !== "ALL" ? { status: statusTab } : {}),
    ...(priorityFilter !== "ALL" ? { priority: priorityFilter } : {}),
    ...(categoryFilter !== "ALL" ? { categoryId: categoryFilter } : {}),
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    sortBy:
      sortByField === "urgency"
        ? "priority"
        : sortByField === "sla"
          ? "resolutionDueAt"
          : "createdAt",
    sortOrder: sortOrderField,
  };

  const {
    data: requestsResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useGetAllRequests(queryParams);

  const rawRequests = requestsResponse?.data ?? [];
  const meta = requestsResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // Enhance sorting client-side when urgency or SLA is selected to guarantee strict priority weighting
  const sortedRequests = useMemo(() => {
    const list = [...rawRequests];

    if (sortByField === "urgency") {
      list.sort((a, b) => {
        const weightA = PRIORITY_WEIGHT[a.priority] || 0;
        const weightB = PRIORITY_WEIGHT[b.priority] || 0;
        return sortOrderField === "asc" ? weightA - weightB : weightB - weightA;
      });
    } else if (sortByField === "sla") {
      list.sort((a, b) => {
        const timeA = a.resolutionDueAt
          ? new Date(a.resolutionDueAt).getTime()
          : Infinity;
        const timeB = b.resolutionDueAt
          ? new Date(b.resolutionDueAt).getTime()
          : Infinity;
        return sortOrderField === "asc" ? timeA - timeB : timeB - timeA;
      });
    }

    return list;
  }, [rawRequests, sortByField, sortOrderField]);

  // Quick stats computed from current results or total
  const urgentCount = rawRequests.filter(
    (r) =>
      r.priority === "URGENT" &&
      r.status !== "RESOLVED" &&
      r.status !== "CLOSED",
  ).length;

  const inProgressCount = rawRequests.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;

  const hasActiveFilters =
    statusTab !== "ALL" ||
    priorityFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    searchInput.trim().length > 0 ||
    sortOption !== "createdAt:desc";

  const handleResetFilters = () => {
    setStatusTab("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
    setSortOption("createdAt:desc");
    setSearchInput("");
    setPage(1);
  };

  const handleToggleUrgencySort = () => {
    if (sortOption === "urgency:desc") {
      setSortOption("createdAt:desc");
    } else {
      setSortOption("urgency:desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Assigned Field Complaints
            </h1>
            <Badge
              variant="warning"
              className="gap-1 font-mono text-[11px] uppercase tracking-wide"
            >
              <HardHat className="size-3" />
              Department Casework
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Triage tickets, sort by priority urgency, and transition status to
            resolve civic complaints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <Badge
              variant="destructive"
              className="gap-1.5 font-mono text-xs px-2.5 py-1 animate-pulse"
            >
              <AlertTriangle className="size-3.5" />
              {urgentCount} Urgent Ticket{urgentCount > 1 ? "s" : ""}
            </Badge>
          )}

          {inProgressCount > 0 && (
            <Badge variant="info" className="font-mono text-xs px-2.5 py-1">
              {inProgressCount} Active In Progress
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw
              className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Triage Control Bar */}
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 space-y-3.5">
          {/* Top row: Search, Category, Priority, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                placeholder="Search case #, title or citizen..."
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
              >
                {PRIORITY_OPTIONS.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
              >
                {SORT_OPTIONS.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: Status Tabs & Quick Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/50">
            <Tabs
              value={statusTab}
              onValueChange={(val) => {
                setStatusTab(val);
                setPage(1);
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="h-8">
                {STATUS_TABS.map(([val, label]) => (
                  <TabsTrigger
                    key={val}
                    value={val}
                    className="text-xs px-2.5 py-1"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant={sortByField === "urgency" ? "default" : "outline"}
                size="sm"
                onClick={handleToggleUrgencySort}
                className="h-8 text-xs gap-1"
              >
                <ArrowUpDown className="size-3" />
                {sortByField === "urgency"
                  ? "Sorted by Urgency"
                  : "Sort Urgency"}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3" />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <StaffRequestsTable
        requests={sortedRequests}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchTerm={debouncedSearch}
        sortBy={sortByField}
        sortOrder={sortOrderField}
        onToggleUrgencySort={handleToggleUrgencySort}
      />
    </div>
  );
}

export default function StaffAssignedPage() {
  return (
    <Suspense fallback={<StaffAssignedLoading />}>
      <StaffAssignedContent />
    </Suspense>
  );
}
