import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  endRoute,
  getRequestRoutes,
  type RouteToDepartmentPayload,
  routeToDepartment,
} from "@/api";

export function useRouteToDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: RouteToDepartmentPayload;
    }) => routeToDepartment(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["routes", variables.requestId],
      });
    },
  });
}

export function useEndRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      routeId,
    }: {
      requestId: string;
      routeId: string;
    }) => endRoute(requestId, routeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["routes", variables.requestId],
      });
    },
  });
}

export function useGetRequestRoutes(requestId: string) {
  return useQuery({
    queryKey: ["routes", requestId],
    queryFn: () => getRequestRoutes(requestId),
    enabled: !!requestId,
  });
}
