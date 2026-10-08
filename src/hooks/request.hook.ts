import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  getAllWards,
  getMyServiceRequests,
  getServiceRequestById,
  uploadRequestAttachment,
} from "@/api";
import type { CreateServiceRequestPayload } from "@/types";

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

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      file,
      purpose,
    }: {
      requestId: string;
      file: File;
      purpose?: "EVIDENCE" | "PHOTO" | "DOCUMENT" | "RECEIPT" | "OTHER";
    }) => uploadRequestAttachment(requestId, file, purpose),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
    },
  });
}

export function useGetWards(params?: { city?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["wards", params],
    queryFn: () => getAllWards(params),
  });
}
