import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateServiceRequestPayload,
  MediaAttachment,
  ServiceRequest,
  Ward,
} from "@/types";

export function createServiceRequest(payload: CreateServiceRequestPayload) {
  return apiClient<ApiResponse<ServiceRequest>>("/service-requests", {
    method: "POST",
    body: payload,
  });
}

export function getMyServiceRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return apiClient<ApiResponse<ServiceRequest[]>>("/service-requests/my", {
    params,
  });
}

export function getServiceRequestById(id: string) {
  return apiClient<ApiResponse<ServiceRequest>>(`/service-requests/${id}`);
}

export function uploadRequestAttachment(
  requestId: string,
  file: File,
  purpose: "EVIDENCE" | "PHOTO" | "DOCUMENT" | "RECEIPT" | "OTHER" = "PHOTO",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);

  return apiClient<ApiResponse<MediaAttachment>>(
    `/service-requests/${requestId}/attachments`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export function getAllWards(params?: { city?: string; isActive?: boolean }) {
  return apiClient<ApiResponse<Ward[]>>("/wards", {
    params,
  });
}
