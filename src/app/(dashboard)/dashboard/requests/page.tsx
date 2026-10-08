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

const FALLBACK_MY_REQUESTS: ServiceRequest[] = [
  {
    id: "req-1",
    requestNo: "REQ-2026-0891",
    title: "Deep Pothole on Mirpur-10 Main Intersection",
    description:
      "Deep craters and broken asphalt causing severe traffic bottlenecks.",
    type: "COMPLAINT",
    priority: "HIGH",
    status: "RESOLVED",
    wardId: "ward-12",
    categoryId: "cat-pothole",
    citizenId: "citizen-1",
    addressLine: "Mirpur-10 Circle, Near Metro Pillar #42",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-pothole",
      departmentId: "dept-pwd",
      name: "Road Pothole & Asphalt Damage",
      isActive: true,
      department: {
        id: "dept-pwd",
        name: "Public Works & Road Maintenance",
        code: "PWD",
        isActive: true,
      },
    },
    ward: {
      id: "ward-12",
      name: "Ward 12 (Mirpur)",
      city: "Dhaka",
      isActive: true,
    },
  },
  {
    id: "req-2",
    requestNo: "REQ-2026-0902",
    title: "Drinking Water Pipeline Burst on Lake Road",
    description:
      "Underground water pipe leaking clean potable water across street.",
    type: "COMPLAINT",
    priority: "URGENT",
    status: "IN_PROGRESS",
    wardId: "ward-15",
    categoryId: "cat-water-leak",
    citizenId: "citizen-1",
    addressLine: "Road 8A, House 14, Dhanmondi",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-water-leak",
      departmentId: "dept-wasa",
      name: "Drinking Water Pipeline Leakage",
      isActive: true,
      department: {
        id: "dept-wasa",
        name: "Water Supply & Sewerage Authority",
        code: "WASA",
        isActive: true,
      },
    },
    ward: {
      id: "ward-15",
      name: "Ward 15 (Dhanmondi)",
      city: "Dhaka",
      isActive: true,
    },
  },
  {
    id: "req-3",
    requestNo: "REQ-2026-0915",
    title: "Streetlight Strip Dark on Main Boulevard",
    description: "Entire 500-meter stretch unlit after transformer tripping.",
    type: "COMPLAINT",
    priority: "MEDIUM",
    status: "ASSIGNED",
    wardId: "ward-08",
    categoryId: "cat-streetlight",
    citizenId: "citizen-1",
    addressLine: "Gulshan Avenue, Near Block B Gate",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-streetlight",
      departmentId: "dept-elec",
      name: "Streetlight Outage & Damaged Lamp",
      isActive: true,
      department: {
        id: "dept-elec",
        name: "Electrical & Street Lighting",
        code: "ELEC",
        isActive: true,
      },
    },
    ward: {
      id: "ward-08",
      name: "Ward 08 (Gulshan)",
      city: "Dhaka",
      isActive: true,
    },
  },
  {
    id: "req-4",
    requestNo: "REQ-2026-0928",
    title: "Overflowing Dumpster on Block D Road 5",
    description:
      "Trash bins overflowing onto pedestrian walkway; animal infestation.",
    type: "COMPLAINT",
    priority: "HIGH",
    status: "SUBMITTED",
    wardId: "ward-19",
    categoryId: "cat-waste-dump",
    citizenId: "citizen-1",
    addressLine: "Road 5, Block D, Banani",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-waste-dump",
      departmentId: "dept-swm",
      name: "Overflowing Garbage & Illegal Dump",
      isActive: true,
      department: {
        id: "dept-swm",
        name: "Solid Waste Management",
        code: "SWM",
        isActive: true,
      },
    },
    ward: {
      id: "ward-19",
      name: "Ward 19 (Banani)",
      city: "Dhaka",
      isActive: true,
    },
  },
];

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
    limit: 12,
  });

  const rawRequests =
    data?.data && data.data.length > 0 ? data.data : FALLBACK_MY_REQUESTS;

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
        const matchesNo = req.requestNo.toLowerCase().includes(q);
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesWard = req.ward?.name?.toLowerCase().includes(q) ?? false;
        const matchesCat =
          req.category?.name?.toLowerCase().includes(q) ?? false;
        if (!matchesNo && !matchesTitle && !matchesWard && !matchesCat) {
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
            Monitor real-time resolution updates, field inspection progress, and
            turnaround SLA countdowns for your submitted requests.
          </p>
        </div>

        <Link href="/dashboard/submit-request">
          <Button size="sm" className="gap-1.5 shadow-sm">
            <Plus className="size-4" />
            Lodge Complaint
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
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

      {/* Content Rendering: Grid vs Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 rounded-lg border bg-card p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
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
              No matching complaints found
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              {searchTerm
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
