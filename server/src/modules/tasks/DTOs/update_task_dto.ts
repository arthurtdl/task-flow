import { z } from "zod";

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  deadline: z.coerce.date().optional(),
  status: z.enum(["BACKLOG", "PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  isPriority: z.boolean().optional(),
});

export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
