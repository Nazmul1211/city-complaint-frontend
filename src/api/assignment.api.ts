import apiClient from "@/lib/apiClient";
import type { ApiResponse, User } from "@/types";

export interface AssignStaffMemberPayload {
  assigneeId: string;
  note?: string;
}

export interface ReleaseAssignmentPayload {
  note?: string;
}

export interface RequestAssignmentItem {
  id: string;
  requestId: string;
  assigneeId: string;
  assignerId?: string;
  note?: string | null;
  assignedAt: string;
  releasedAt?: string | null;
  assignee?: User;
}

export function assignStaffMember(
  requestId: string,
  payload: AssignStaffMemberPayload,
) {
  return apiClient<ApiResponse<RequestAssignmentItem>>(
    `/requests/${requestId}/assignments`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getRequestAssignments(
  requestId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
) {
  return apiClient<ApiResponse<RequestAssignmentItem[]>>(
    `/requests/${requestId}/assignments`,
    {
      params,
    },
  );
}

export function releaseAssignment(
  requestId: string,
  assignmentId: string,
  payload?: ReleaseAssignmentPayload,
) {
  return apiClient<ApiResponse<RequestAssignmentItem>>(
    `/requests/${requestId}/assignments/${assignmentId}/release`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}
