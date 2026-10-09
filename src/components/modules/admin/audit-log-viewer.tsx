"use client";

import { Activity, Code, FileCode, RefreshCw, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import type { AuditLogItem } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useGetAuditActions, useGetAuditLogs } from "@/hooks";

export function AuditLogViewer() {
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  // Selected log for detailed JSON diff modal
  const [inspectingLog, setInspectingLog] = useState<AuditLogItem | null>(null);

  const { data: actionsResponse } = useGetAuditActions();
  const availableActions = actionsResponse?.data || [];

  const {
    data: logsResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useGetAuditLogs({
    page: currentPage,
    limit: pageSize,
    action: selectedAction !== "ALL" ? selectedAction : undefined,
    entityType: selectedEntityType !== "ALL" ? selectedEntityType : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const logs = useMemo(() => {
    return logsResponse?.data || [];
  }, [logsResponse]);

  const totalPages =
    (logsResponse as unknown as { meta?: { totalPages?: number } })?.meta
      ?.totalPages || 1;

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (
      act.includes("CREATE") ||
      act.includes("REGISTER") ||
      act.includes("ROUT")
    ) {
      return (
        <Badge variant="success" className="font-mono text-[10px]">
          {action}
        </Badge>
      );
    }
    if (
      act.includes("DELETE") ||
      act.includes("BLOCK") ||
      act.includes("CANCEL")
    ) {
      return (
        <Badge variant="destructive" className="font-mono text-[10px]">
          {action}
        </Badge>
      );
    }
    if (
      act.includes("STATUS") ||
      act.includes("UPDATE") ||
      act.includes("ASSIGN")
    ) {
      return (
        <Badge variant="info" className="font-mono text-[10px]">
          {action}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="font-mono text-[10px]">
        {action}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and Refresh */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
            <div className="w-full sm:w-64">
              <select
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by audit action"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Audit Actions</option>
                {availableActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-48">
              <select
                value={selectedEntityType}
                onChange={(e) => {
                  setSelectedEntityType(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by target entity"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Entity Types</option>
                <option value="SERVICE_REQUEST">SERVICE_REQUEST</option>
                <option value="USER">USER</option>
                <option value="DEPARTMENT">DEPARTMENT</option>
                <option value="CATEGORY">CATEGORY</option>
                <option value="SLA_POLICY">SLA_POLICY</option>
                <option value="WARD">WARD</option>
                <option value="PAYMENT">PAYMENT</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
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
              <span className="hidden sm:inline">Refresh Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span>Immutable Governance Audit Trail</span>
            </div>
            <span className="text-xs font-normal text-muted-foreground">
              Real-time administrative ledger
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[170px] text-xs">Timestamp</TableHead>
                  <TableHead className="w-[180px] text-xs">
                    Action Event
                  </TableHead>
                  <TableHead className="w-[200px] text-xs">
                    Actor Identity
                  </TableHead>
                  <TableHead className="w-[170px] text-xs">
                    Target Entity
                  </TableHead>
                  <TableHead className="w-[120px] text-xs">
                    IP / Origin
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    State Changes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk-a1", "sk-a2", "sk-a3", "sk-a4", "sk-a5"].map(
                    (rowKey) => (
                      <TableRow key={rowKey}>
                        <TableCell>
                          <Skeleton className="h-4 w-28 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-7 w-20 ml-auto rounded-md" />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Activity className="size-8 stroke-1 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                          No audit entries recorded for this filter
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const hasDiff = Boolean(log.oldValues || log.newValues);

                    return (
                      <TableRow
                        key={log.id}
                        className="hover:bg-muted/40 text-xs"
                      >
                        {/* Timestamp */}
                        <TableCell>
                          <div className="font-mono text-foreground">
                            {new Date(log.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground">
                            {new Date(log.createdAt).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              },
                            )}
                          </div>
                        </TableCell>

                        {/* Action Event */}
                        <TableCell>{getActionBadge(log.action)}</TableCell>

                        {/* Actor Identity */}
                        <TableCell>
                          {log.actor ? (
                            <div>
                              <div className="font-semibold text-foreground truncate">
                                {log.actor.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground truncate">
                                {log.actor.email} ({log.actor.role})
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-[11px]">
                              System Automated
                            </span>
                          )}
                        </TableCell>

                        {/* Target Entity */}
                        <TableCell>
                          <div className="font-medium text-foreground">
                            {log.entityType}
                          </div>
                          <div
                            className="text-[10px] font-mono text-muted-foreground truncate"
                            title={log.entityId}
                          >
                            {log.entityId.slice(0, 12)}...
                          </div>
                        </TableCell>

                        {/* IP Address */}
                        <TableCell className="font-mono text-[11px] text-muted-foreground">
                          {log.ipAddress || "127.0.0.1"}
                        </TableCell>

                        {/* State Changes Inspection */}
                        <TableCell className="text-right">
                          {hasDiff ? (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setInspectingLog(log)}
                              className="gap-1 text-[11px] h-7"
                              title="Inspect state before and after change"
                            >
                              <FileCode className="size-3 text-primary" />
                              <span>Diff Preview</span>
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              No payload
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-3 border-t bg-muted/20">
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* JSON Diff Inspection Dialog */}
      <Dialog
        open={!!inspectingLog}
        onOpenChange={(open) => !open && setInspectingLog(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Code className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Audit State Diff Preview
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Event: {inspectingLog?.action} on {inspectingLog?.entityType}{" "}
                  (ID: {inspectingLog?.entityId})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {inspectingLog && (
            <div className="flex-1 overflow-y-auto space-y-3 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Old Values */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between">
                    <span>Previous State (Before)</span>
                    <Badge variant="destructive" className="text-[9px]">
                      OLD
                    </Badge>
                  </div>
                  <pre className="p-3 rounded-lg border bg-rose-500/5 text-[11px] font-mono text-foreground overflow-x-auto max-h-[280px]">
                    {inspectingLog.oldValues
                      ? JSON.stringify(inspectingLog.oldValues, null, 2)
                      : "null (Created fresh)"}
                  </pre>
                </div>

                {/* New Values */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                    <span>Recorded State (After)</span>
                    <Badge variant="success" className="text-[9px]">
                      NEW
                    </Badge>
                  </div>
                  <pre className="p-3 rounded-lg border bg-emerald-500/5 text-[11px] font-mono text-foreground overflow-x-auto max-h-[280px]">
                    {inspectingLog.newValues
                      ? JSON.stringify(inspectingLog.newValues, null, 2)
                      : "null (Deleted / Cleared)"}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
