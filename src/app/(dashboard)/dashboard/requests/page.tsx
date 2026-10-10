"use client";

import { Plus, SearchX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  RequestCard,
  RequestFilterBar,
  RequestTable,
} from "@/components/modules/requests";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/ui/table-pagination";
import { useGetMyRequests } from "@/hooks";
import type { ServiceRequest } from "@/types";

export default function MyRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading complaints dashboard...
        </div>
      }
    >
      <MyRequestsContent />
    </Suspense>
  );
}

function MyRequestsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state from URL
  const statusParam = searchParams.get("status") || "ALL";
  const priorityParam = searchParams.get("priority") || "ALL";
  const searchParam = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page")) || 1;
  const viewParam = (searchParams.get("view") as "grid" | "table") || "grid";

  const [statusTab, setStatusTab] = useState(statusParam);
  const [priorityFilter, setPriorityFilter] = useState(priorityParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [page, setPage] = useState(pageParam);
  const [viewMode, setViewMode] = useState<"grid" | "table">(viewParam);

  const updateUrl = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (
        v === undefined ||
        v === "" ||
        v === "ALL" ||
        (k === "page" && v === 1)
      ) {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (val: string) => {
    setStatusTab(val);
    setPage(1);
    updateUrl({ status: val, page: 1 });
  };

  const handlePriorityChange = (val: string) => {
    setPriorityFilter(val);
    setPage(1);
    updateUrl({ priority: val, page: 1 });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
    updateUrl({ search: val, page: 1 });
  };

  const handleViewModeChange = (mode: "grid" | "table") => {
    setViewMode(mode);
    updateUrl({ view: mode === "grid" ? undefined : mode });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };

  const { data, isLoading } = useGetMyRequests({
    status: statusTab === "ALL" ? undefined : statusTab,
    page,
    limit: 50,
  });

  const rawRequests: ServiceRequest[] = data?.data || [];

  // Filter client-side for immediate reactivity
  const filtered = useMemo(() => {
    return rawRequests.filter((req) => {
      if (statusTab !== "ALL" && req.status !== statusTab) {
        return false;
      }
      if (priorityFilter !== "ALL" && req.priority !== priorityFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesNo = req.requestNo?.toLowerCase().includes(q) ?? false;
        const matchesTitle = req.title?.toLowerCase().includes(q) ?? false;
        const matchesDesc = req.description?.toLowerCase().includes(q) ?? false;
        const matchesWard =
          (req.ward?.name?.toLowerCase().includes(q) ||
            req.reportedLocation?.ward?.name?.toLowerCase().includes(q)) ??
          false;
        const matchesAddress =
          (req.addressLine?.toLowerCase().includes(q) ||
            req.reportedLocation?.addressLine?.toLowerCase().includes(q) ||
            req.landmark?.toLowerCase().includes(q) ||
            req.reportedLocation?.landmark?.toLowerCase().includes(q)) ??
          false;
        const matchesCat =
          req.category?.name?.toLowerCase().includes(q) ?? false;
        if (
          !matchesNo &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesWard &&
          !matchesAddress &&
          !matchesCat
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawRequests, statusTab, priorityFilter, searchTerm]);

  const pageSize = 6;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedRequests = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Filed Complaints
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Track status, view department assignments, and review field
            inspections for all complaints submitted from your account.
          </p>
        </div>

        <Link href="/dashboard/submit-request">
          <Button size="sm" className="gap-1.5 shadow-sm">
            <Plus className="size-4" />
            Lodge Complaint
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <RequestFilterBar
        statusTab={statusTab}
        onStatusChange={handleStatusChange}
        priorityFilter={priorityFilter}
        onPriorityChange={handlePriorityChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Requests List Grid or Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <div className="border-t pt-3 space-y-1.5">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <span className="rounded-full bg-muted p-3">
              <SearchX className="size-5 text-muted-foreground" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {rawRequests.length === 0
                ? "No complaints filed yet"
                : "No matching complaints found"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              {rawRequests.length === 0
                ? "You haven't lodged any civic complaints. Click below to report an issue in your neighborhood."
                : searchTerm
                  ? `No requests match "${searchTerm}". Try adjusting your filters.`
                  : "You have no complaints matching the selected status."}
            </p>
            <Link href="/dashboard/submit-request" className="mt-4">
              <Button size="sm">File a New Complaint</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center pt-2">
                <TablePagination
                  page={page}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <RequestTable
          requests={paginatedRequests}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}
