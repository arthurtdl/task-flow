import api from './api';
import { CreateAttachment, Attachment } from '@/types/attachment_types';
import { supabase } from '@/lib/supabase';

export const attachmentService = {
  uploadToSupabase: async (file: File) => {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no upload do Supabase:", uploadError);
      throw new Error("Não foi possível enviar o arquivo.");
    }

    const { data } = supabase.storage
      .from("attachments")
      .getPublicUrl(filePath);

    return {
      fileName: file.name,
      fileUrl: data.publicUrl,
      fileType: file.type,
    };
  },

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