import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentService } from "@/services/attachment_service";
import type { CreateAttachment } from "@/types/attachment_types";

// ==========================================
// QUERIES (GET)
// ==========================================


export function useAttachmentsByTask(taskId?: string) {
  return useQuery({
    queryKey: ["attachments", "task", taskId],
    queryFn: () => attachmentService.getAttachmentsByTaskId(taskId!),
    enabled: !!taskId,
  });
}

// ==========================================
// MUTATIONS (POST, DELETE)
// ==========================================

export function useCreateAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttachment) => attachmentService.createAttachment(data),
    onSuccess: (newAttachment) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", "task", newAttachment.taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attachmentService.deleteAttachment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
}