import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .nonempty({ message: 'Title is required' }),
  description: z
    .string()
    .optional(),
  deadline: z
    .coerce
    .date()
    .optional(),
  status: z
    .enum(['BACKLOG', 'PENDING', 'IN_PROGRESS', 'COMPLETED'], { message: 'Status must be one of BACKLOG, PENDING, IN_PROGRESS, or COMPLETED' })
    .optional(),
  isPriority: z
    .boolean()
    .optional(),
  userId: z
    .string()
    .uuid({ message: 'Invalid User ID format' })
    .nonempty({ message: 'User ID is required' }),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;