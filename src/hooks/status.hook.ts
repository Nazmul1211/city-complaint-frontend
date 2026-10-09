import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ChangeStatusPayload,
  getRequestStatusHistory,
  updateRequestStatus,
} from "@/api";

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: ChangeStatusPayload;
    }) => updateRequestStatus(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["status-history", variables.requestId],
      });
    },
  });
}

export function useGetStatusHistory(
  requestId: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["status-history", requestId, params],
    queryFn: () => getRequestStatusHistory(requestId, params),
    enabled: !!requestId,
  });
}
