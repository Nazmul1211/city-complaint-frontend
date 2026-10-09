import apiClient from "@/lib/apiClient";
import type { ApiResponse, Ward } from "@/types";

export interface CreateWardPayload {
  name: string;
  code: string;
  city: string;
  isActive?: boolean;
}

export interface UpdateWardPayload {
  name?: string;
  code?: string;
  city?: string;
  isActive?: boolean;
}

export function getWards(params?: { city?: string; isActive?: boolean }) {
  return apiClient<ApiResponse<Ward[]>>("/wards", {
    params,
  });
}

export function getWardById(id: string) {
  return apiClient<ApiResponse<Ward>>(`/wards/${id}`);
}

export function createWard(payload: CreateWardPayload) {
  return apiClient<ApiResponse<Ward>>("/wards", {
    method: "POST",
    body: payload,
  });
}

export function updateWard(id: string, payload: UpdateWardPayload) {
  return apiClient<ApiResponse<Ward>>(`/wards/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteWard(id: string) {
  return apiClient<ApiResponse<null>>(`/wards/${id}`, {
    method: "DELETE",
  });
}
