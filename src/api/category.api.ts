import apiClient from "@/lib/apiClient";
import type { ApiResponse, Category, SlaPolicy } from "@/types";

export interface CreateCategoryPayload {
  departmentId: string;
  name: string;
  description?: string;
  paymentRequired?: boolean;
  defaultFeeAmount?: number;
  currency?: string;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
  paymentRequired?: boolean;
  defaultFeeAmount?: number | null;
  currency?: string;
  isActive?: boolean;
}

export interface SlaPolicyPayload {
  responseWithinHours: number;
  resolutionWithinHours: number;
  reopenWindowHours?: number;
  isActive?: boolean;
}

export function getAllCategories(departmentId?: string) {
  return apiClient<ApiResponse<Category[]>>("/categories", {
    params: departmentId ? { departmentId } : undefined,
  });
}

export function getCategoryById(id: string) {
  return apiClient<ApiResponse<Category>>(`/categories/${id}`);
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return apiClient<ApiResponse<Category>>(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(id: string) {
  return apiClient<ApiResponse<null>>(`/categories/${id}`, {
    method: "DELETE",
  });
}

export function getCategorySla(categoryId: string) {
  return apiClient<ApiResponse<SlaPolicy>>(`/categories/${categoryId}/sla`);
}

export function createCategorySla(
  categoryId: string,
  payload: SlaPolicyPayload,
) {
  return apiClient<ApiResponse<SlaPolicy>>(`/categories/${categoryId}/sla`, {
    method: "POST",
    body: payload,
  });
}

export function updateCategorySla(
  categoryId: string,
  payload: Partial<SlaPolicyPayload>,
) {
  return apiClient<ApiResponse<SlaPolicy>>(`/categories/${categoryId}/sla`, {
    method: "PATCH",
    body: payload,
  });
}
