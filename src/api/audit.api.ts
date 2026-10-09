import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export interface AuditLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  actor?: AuditLogActor | null;
}

export interface AuditLogFilterParams {
  action?: string;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function getAuditLogs(params?: AuditLogFilterParams) {
  return apiClient<ApiResponse<AuditLogItem[]>>("/audit-logs", {
    params,
  });
}

export function getAuditActions() {
  return apiClient<ApiResponse<string[]>>("/audit-logs/actions");
}
