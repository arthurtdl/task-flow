import api from './api';
import { CreateAttachment, Attachment } from '@/types/attachment_types';

export const attachmentService = {
  createAttachment: async (data: CreateAttachment): Promise<Attachment> => {
    const response = await api.post('/attachments', data);
    return response.data.data;
  },

  getAttachmentsByTaskId: async (taskId: string): Promise<Attachment[]> => {
    const response = await api.get(`/attachments/task/${taskId}`);
    return response.data.data;
  },

  deleteAttachment: async (id: string): Promise<void> => {
    // There's no data to 'extract'
    await api.delete(`/attachments/${id}`);
  },
};