import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AssignStaffMemberPayload,
  assignStaffMember,
  getRequestAssignments,
  type ReleaseAssignmentPayload,
  releaseAssignment,
} from "@/api";

export function useAssignStaffMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: AssignStaffMemberPayload;
    }) => assignStaffMember(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["staff-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.requestId],
      });
    },
  });
}

export function useReleaseAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      assignmentId,
      payload,
    }: {
      requestId: string;
      assignmentId: string;
      payload?: ReleaseAssignmentPayload;
    }) => releaseAssignment(requestId, assignmentId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["staff-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.requestId],
      });
    },
  });
}

export function useGetRequestAssignments(
  requestId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
) {
  return useQuery({
    queryKey: ["assignments", requestId, params],
    queryFn: () => getRequestAssignments(requestId, params),
    enabled: !!requestId,
  });
}
