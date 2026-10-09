import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  markAllAsRead,
  markAsRead,
} from "@/api/notification.api";
import type { NotificationFilterParams } from "@/types";

export function useNotifications(
  params?: NotificationFilterParams,
  options?: { refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getMyNotifications(params),
    refetchInterval: options?.refetchInterval ?? 20000, // Background poll every 20s for active updates
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
