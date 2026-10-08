import { useQuery } from "@tanstack/react-query";
import { getRequestTimeline, getRequestUpdates } from "@/api";

export function useRequestTimeline(requestId: string) {
  return useQuery({
    queryKey: ["timeline", requestId],
    queryFn: () => getRequestTimeline(requestId),
    enabled: !!requestId,
  });
}

export function useRequestUpdates(requestId: string) {
  return useQuery({
    queryKey: ["updates", requestId],
    queryFn: () => getRequestUpdates(requestId),
    enabled: !!requestId,
  });
}
