import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Notification,
  NotificationFilterParams,
} from "@/types";

export function getMyNotifications(params?: NotificationFilterParams) {
  return apiClient<ApiResponse<Notification[]>>("/notifications", {
    params,
  });
}

export function markAsRead(id: string) {
  return apiClient<ApiResponse<{ id: string; readAt: string }>>(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
    },
  );
}

export function markAllAsRead() {
  return apiClient<ApiResponse<{ count: number }>>("/notifications/read-all", {
    method: "PATCH",
  });
}
