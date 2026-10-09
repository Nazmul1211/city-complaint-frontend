import apiClient from "@/lib/apiClient";
import type { ApiResponse, UpdateMyProfilePayload, User } from "@/types";

export function getMyProfile() {
  return apiClient<ApiResponse<User>>("/users/me");
}

export function updateMyProfile(payload: UpdateMyProfilePayload) {
  return apiClient<ApiResponse<User>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProfileImage(formData: FormData) {
  return apiClient<ApiResponse<User>>("/users/profile-image", {
    method: "PATCH",
    body: formData,
  });
}

export function deleteMyAccount() {
  return apiClient<ApiResponse<null>>("/users/me", {
    method: "DELETE",
  });
}

export interface UserFilterParams {
  role?: string;
  status?: string;
  departmentId?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function getAllUsers(params?: UserFilterParams) {
  return apiClient<ApiResponse<User[]>>("/users", {
    params,
  });
}
