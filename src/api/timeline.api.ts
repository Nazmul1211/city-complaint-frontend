import apiClient from "@/lib/apiClient";
import type { ApiResponse, TimelineEvent, WorkUpdate } from "@/types";

export function getRequestTimeline(requestId: string) {
  return apiClient<ApiResponse<TimelineEvent[]>>(
    `/service-requests/${requestId}/timeline`,
  );
}

export function getRequestUpdates(requestId: string) {
  return apiClient<ApiResponse<WorkUpdate[]>>(
    `/service-requests/${requestId}/updates`,
  );
}
