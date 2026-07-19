import { z } from 'zod';

export const createAttachmentSchema = z.object({
  fileName: z
    .string()
    .nonempty({ message: 'File name is required' }),
  fileUrl: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .nonempty({ message: 'File URL is required' }),
  fileType: z
    .string()
    .nonempty({ message: 'File type is required' }),
  taskId: z
    .string()
    .uuid({ message: 'Invalid Task ID format' })
    .nonempty({ message: 'Task ID is required' }),
});

export type CreateAttachmentDTO = z.infer<typeof createAttachmentSchema>;