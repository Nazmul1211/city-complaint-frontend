import { ArrowRight, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
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

interface RequestTableProps {
  requests: ServiceRequest[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
}

export function RequestTable({
  requests,
  page,
  totalPages,
  onPageChange,
  searchTerm,
}: RequestTableProps) {
  const isEmpty = requests.length === 0;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Case #</TableHead>
              <TableHead>Complaint Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Filed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-semibold text-foreground">
                      No complaints found
                    </p>
                    <p className="max-w-sm text-xs text-muted-foreground">
                      {searchTerm
                        ? `No complaints match "${searchTerm}". Try adjusting your keywords or status filters.`
                        : "You haven't filed any complaints matching this criteria."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => {
                const dateStr = new Date(req.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                );

                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {req.requestNo}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate font-medium text-foreground"
                      title={req.title}
                    >
                      {req.title}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {req.category?.name ?? "Service"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {req.ward?.name ?? "Ward"}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={req.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {dateStr}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/requests/${req.id}`}>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="gap-1 text-xs"
                        >
                          Details
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
