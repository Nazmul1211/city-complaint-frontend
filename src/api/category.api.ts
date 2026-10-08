import apiClient from "@/lib/apiClient";
import type { ApiResponse, Category } from "@/types";

export function getAllCategories(departmentId?: string) {
  return apiClient<ApiResponse<Category[]>>("/categories", {
    params: departmentId ? { departmentId } : undefined,
  });
}

export function getCategoryById(id: string) {
  return apiClient<ApiResponse<Category>>(`/categories/${id}`);
}
