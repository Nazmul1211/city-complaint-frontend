import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addWorkUpdate,
  type CreateWorkUpdatePayload,
  getWorkUpdates,
} from "@/api";

export function useAddWorkUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: CreateWorkUpdatePayload;
    }) => addWorkUpdate(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["work-updates", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["updates", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
    },
  });
}

export function useGetWorkUpdates(
  requestId: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["work-updates", requestId, params],
    queryFn: () => getWorkUpdates(requestId, params),
    enabled: !!requestId,
  });
}
