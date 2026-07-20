export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  taskId: string;
  createdAt: string;
}

export interface CreateAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  taskId: string;
}
