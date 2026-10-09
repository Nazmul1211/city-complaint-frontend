import { useQuery } from "@tanstack/react-query";
import {
  type AuditLogFilterParams,
  getAuditActions,
  getAuditLogs,
} from "@/api";

export function useGetAuditLogs(params?: AuditLogFilterParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
}

export function useGetAuditActions() {
  return useQuery({
    queryKey: ["audit-actions"],
    queryFn: getAuditActions,
  });
}
