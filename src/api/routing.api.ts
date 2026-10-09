import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export interface RouteToDepartmentPayload {
  departmentId: string;
  reason?: string;
}

export interface RequestRouteItem {
  id: string;
  requestId: string;
  departmentId: string;
  reason?: string | null;
  routedAt: string;
  endedAt?: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export function routeToDepartment(
  requestId: string,
  payload: RouteToDepartmentPayload,
) {
  return apiClient<ApiResponse<RequestRouteItem>>(
    `/service-requests/${requestId}/routes`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getRequestRoutes(requestId: string) {
  return apiClient<ApiResponse<RequestRouteItem[]>>(
    `/service-requests/${requestId}/routes`,
  );
}

export function endRoute(requestId: string, routeId: string) {
  return apiClient<ApiResponse<RequestRouteItem>>(
    `/service-requests/${requestId}/routes/${routeId}/end`,
    {
      method: "PATCH",
    },
  );
}
