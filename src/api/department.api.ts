import apiClient from "@/lib/apiClient";
import type { ApiResponse, Department } from "@/types";

export interface CreateDepartmentPayload {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentPayload {
  name?: string;
  code?: string;
  description?: string | null;
  isActive?: boolean;
}

export function getAllDepartments() {
  return apiClient<ApiResponse<Department[]>>("/departments");
}

export function getDepartmentById(id: string) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`);
}

export function createDepartment(payload: CreateDepartmentPayload) {
  return apiClient<ApiResponse<Department>>("/departments", {
    method: "POST",
    body: payload,
  });
}

export function updateDepartment(id: string, payload: UpdateDepartmentPayload) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDepartment(id: string) {
  return apiClient<ApiResponse<null>>(`/departments/${id}`, {
    method: "DELETE",
  });
}
