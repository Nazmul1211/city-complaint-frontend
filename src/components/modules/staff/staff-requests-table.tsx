"use client";

import {
  ArrowRight,
  ArrowUpDown,
  Building2,
  FileText,
  MapPin,
  Phone,
  SearchX,
  User,
} from "lucide-react";
import Link from "next/link";
import { SlaCountdownBadge } from "@/components/modules/requests/sla-countdown-badge";
import { PriorityTag } from "@/components/modules/staff/priority-tag";
import { Button } from "@/components/ui/button";
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
import type { ServiceRequest } from "@/types";

interface StaffRequestsTableProps {
  requests: ServiceRequest[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onToggleUrgencySort?: () => void;
}

const SKELETON_TABLE_ROWS = [
  "table-row-1",
  "table-row-2",
  "table-row-3",
  "table-row-4",
  "table-row-5",
  "table-row-6",
];

export function StaffRequestsTable({
  requests,
  isLoading = false,
  page,
  totalPages,
  onPageChange,
  searchTerm = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  onToggleUrgencySort,
}: StaffRequestsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Case #</TableHead>
              <TableHead>Citizen</TableHead>
              <TableHead>Complaint & Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA Due</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SKELETON_TABLE_ROWS.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36 mt-1" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const isEmpty = requests.length === 0;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/40">
              <TableHead className="w-[130px] font-semibold text-foreground">
                Request No
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Citizen
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[220px]">
                Complaint & Category
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <button
                  type="button"
                  onClick={onToggleUrgencySort}
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group"
                  title={`Sort by Priority Urgency (current: ${sortBy} ${sortOrder})`}
                >
                  <span>Priority</span>
                  <ArrowUpDown className="size-3 text-muted-foreground group-hover:text-primary" />
                </button>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                SLA Due
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-2.5 px-6 py-14 text-center">
                    <span className="rounded-full bg-muted p-3.5 ring-1 ring-border">
                      <SearchX className="size-6 text-muted-foreground" />
                    </span>
                    <p className="text-base font-semibold text-foreground">
                      No matching casework found
                    </p>
                    <p className="max-w-md text-xs text-muted-foreground">
                      {searchTerm
                        ? `No assigned complaints match keyword "${searchTerm}". Try resetting your search or adjusting filters.`
                        : "There are currently no tickets matching your active filter criteria."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => {
                const wardName =
                  req.reportedLocation?.ward?.name ||
                  req.ward?.name ||
                  "Municipal Ward";
                const categoryName = req.category?.name || "General Service";
                const citizenName = req.citizen?.name || "Citizen Reporter";
                const citizenContact =
                  req.citizen?.contactNumber || req.citizen?.email || "-";
                const filedDate = new Date(req.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                );

                return (
                  <TableRow
                    key={req.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    {/* 1. Request No */}
                    <TableCell className="font-mono text-xs font-bold text-primary whitespace-nowrap">
                      <div className="space-y-1">
                        <span>{req.requestNo}</span>
                        <div className="text-[10px] text-muted-foreground font-sans font-normal">
                          {filedDate}
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Citizen */}
                    <TableCell>
                      <div className="space-y-0.5 min-w-[140px]">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <User className="size-3 text-muted-foreground shrink-0" />
                          <span className="truncate" title={citizenName}>
                            {citizenName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Phone className="size-2.5 shrink-0" />
                          <span className="truncate" title={citizenContact}>
                            {citizenContact}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 3. Title & Category */}
                    <TableCell>
                      <div className="space-y-1 max-w-[260px]">
                        <div
                          className="font-medium text-xs text-foreground truncate"
                          title={req.title}
                        >
                          {req.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-0.5 text-primary/90 font-medium">
                            <Building2 className="size-2.5" />
                            {categoryName}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin className="size-2.5" />
                            {wardName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 4. Priority */}
                    <TableCell>
                      <PriorityTag priority={req.priority} />
                    </TableCell>

                    {/* 5. Status */}
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>

                    {/* 6. SLA Due */}
                    <TableCell>
                      <div className="space-y-1">
                        <SlaCountdownBadge
                          status={req.status}
                          resolutionDueAt={req.resolutionDueAt}
                          responseDueAt={req.responseDueAt}
                        />
                        {req.resolutionDueAt &&
                          req.status !== "RESOLVED" &&
                          req.status !== "CLOSED" && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              Due:{" "}
                              {new Date(req.resolutionDueAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "numeric",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          )}
                      </div>
                    </TableCell>

                    {/* 7. Actions */}
                    <TableCell className="text-right">
                      <Link href={`/dashboard/requests/${req.id}`}>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="gap-1 text-xs hover:text-primary hover:bg-primary/10"
                        >
                          <FileText className="size-3" />
                          Triage
                          <ArrowRight className="size-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
