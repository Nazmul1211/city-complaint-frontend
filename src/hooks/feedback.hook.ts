import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestFeedback, submitFeedback } from "@/api";
import type { CreateFeedbackPayload } from "@/types";

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: CreateFeedbackPayload;
    }) => submitFeedback(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["feedback", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
}

export function useRequestFeedback(requestId: string) {
  return useQuery({
    queryKey: ["feedback", requestId],
    queryFn: () => getRequestFeedback(requestId),
    enabled: !!requestId,
    retry: false,
  });
}
