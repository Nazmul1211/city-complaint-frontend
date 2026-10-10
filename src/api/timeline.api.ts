import apiClient from "@/lib/apiClient";
import type { ApiResponse, TimelineEvent, WorkUpdate } from "@/types";

export function getRequestTimeline(requestId: string) {
  return apiClient<ApiResponse<TimelineEvent[]>>(
    `/requests/${requestId}/timeline`,
  );
}

export function getRequestUpdates(requestId: string) {
  return apiClient<ApiResponse<WorkUpdate[]>>(
    `/requests/${requestId}/updates`,
  );
}
