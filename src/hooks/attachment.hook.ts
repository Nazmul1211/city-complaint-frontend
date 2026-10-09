import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AttachmentPurposeType,
  deleteAttachment,
  getAttachments,
  uploadAttachment,
} from "@/api";

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      file,
      purpose = "PHOTO",
    }: {
      requestId: string;
      file: File;
      purpose?: AttachmentPurposeType;
    }) => uploadAttachment(requestId, file, purpose),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attachments", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", variables.requestId],
      });
    },
  });
}

export function useGetAttachments(
  requestId: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["attachments", requestId, params],
    queryFn: () => getAttachments(requestId, params),
    enabled: !!requestId,
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      attachmentId,
    }: {
      requestId: string;
      attachmentId: string;
    }) => deleteAttachment(requestId, attachmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attachments", variables.requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.requestId],
      });
    },
  });
}
