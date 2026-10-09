import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  getAllServiceRequests,
  getAllWards,
  getMyServiceRequests,
  getServiceRequestById,
} from "@/api";
import type { CreateServiceRequestPayload, RequestFilterParams } from "@/types";

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServiceRequestPayload) =>
      createServiceRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useGetAllRequests(params?: RequestFilterParams) {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () => getAllServiceRequests(params),
  });
}

export function useGetMyRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: ["my-requests", params],
    queryFn: () => getMyServiceRequests(params),
  });
}

export function useGetServiceRequestById(id: string) {
  return useQuery({
    queryKey: ["request", id],
    queryFn: () => getServiceRequestById(id),
    enabled: !!id,
  });
}

export function useGetWards(params?: { city?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["wards", params],
    queryFn: () => getAllWards(params),
  });
}
