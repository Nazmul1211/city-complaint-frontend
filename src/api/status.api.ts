import apiClient from "@/lib/apiClient";
import type { ApiResponse, RequestStatus } from "@/types";

export interface ChangeStatusPayload {
  toStatus: RequestStatus;
  note?: string;
}

export interface StatusHistoryItem {
  id: string;
  requestId: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  note?: string | null;
  changedById: string;
  createdAt: string;
  changedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export function updateRequestStatus(
  requestId: string,
  payload: ChangeStatusPayload,
) {
  return apiClient<ApiResponse<StatusHistoryItem>>(
    `/service-requests/${requestId}/status`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function getRequestStatusHistory(
  requestId: string,
  params?: { page?: number; limit?: number },
) {
  return apiClient<ApiResponse<StatusHistoryItem[]>>(
    `/service-requests/${requestId}/status/history`,
    {
      params,
    },
  );
}
