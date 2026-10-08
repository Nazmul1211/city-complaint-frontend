import apiClient from "@/lib/apiClient";
import type { ApiResponse, CreateFeedbackPayload, Feedback } from "@/types";

export function submitFeedback(
  requestId: string,
  payload: CreateFeedbackPayload,
) {
  return apiClient<ApiResponse<Feedback>>(`/requests/${requestId}/feedback`, {
    method: "POST",
    body: payload,
  });
}

export function getRequestFeedback(requestId: string) {
  return apiClient<ApiResponse<Feedback>>(`/requests/${requestId}/feedback`);
}
