import apiClient from "@/lib/apiClient";
import type { ApiResponse, WorkUpdate } from "@/types";

export interface CreateWorkUpdatePayload {
  note: string;
  visibleToCitizen?: boolean;
}

export function addWorkUpdate(
  requestId: string,
  payload: CreateWorkUpdatePayload,
) {
  return apiClient<ApiResponse<WorkUpdate>>(
    `/requests/${requestId}/updates`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getWorkUpdates(
  requestId: string,
  params?: { page?: number; limit?: number },
) {
  return apiClient<ApiResponse<WorkUpdate[]>>(
    `/requests/${requestId}/updates`,
    {
      params,
    },
  );
}
