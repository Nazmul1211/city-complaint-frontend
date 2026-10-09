import apiClient from "@/lib/apiClient";
import type { ApiResponse, MediaAttachment } from "@/types";

export type AttachmentPurposeType =
  | "PHOTO"
  | "EVIDENCE"
  | "DOCUMENT"
  | "RECEIPT"
  | "OTHER";

export function uploadAttachment(
  requestId: string,
  file: File,
  purpose: AttachmentPurposeType = "PHOTO",
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

export function getAttachments(
  requestId: string,
  params?: { page?: number; limit?: number },
) {
  return apiClient<ApiResponse<MediaAttachment[]>>(
    `/service-requests/${requestId}/attachments`,
    {
      params,
    },
  );
}

export function deleteAttachment(requestId: string, attachmentId: string) {
  return apiClient<ApiResponse<null>>(
    `/service-requests/${requestId}/attachments/${attachmentId}`,
    {
      method: "DELETE",
    },
  );
}
