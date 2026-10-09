import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateWardPayload,
  createWard,
  deleteWard,
  getWardById,
  getWards,
  type UpdateWardPayload,
  updateWard,
} from "@/api";

export function useGetWards(params?: { city?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["wards", params],
    queryFn: () => getWards(params),
  });
}

export function useGetWardById(id: string) {
  return useQuery({
    queryKey: ["ward", id],
    queryFn: () => getWardById(id),
    enabled: !!id,
  });
}

export function useCreateWard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWardPayload) => createWard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wards"] });
    },
  });
}

export function useUpdateWard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWardPayload }) =>
      updateWard(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      queryClient.invalidateQueries({ queryKey: ["ward", variables.id] });
    },
  });
}

export function useDeleteWard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWard(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      queryClient.invalidateQueries({ queryKey: ["ward", id] });
    },
  });
}
