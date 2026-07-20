import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task_service";
import type { CreateTask, UpdateTask } from "@/types/task_types";

// ==========================================
// QUERIES (GET)
// ==========================================

export function useTasksByUser(userId?: string) {
  return useQuery({
    queryKey: ["tasks", "user", userId],
    queryFn: () => taskService.getTasksByUserId(userId!),
    enabled: !!userId,
  });
}

export function useTask(taskId?: string) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => taskService.getTaskById(taskId!),
    enabled: !!taskId,
  });
}

export function useAllTasks(enabled: boolean = true) {
  return useQuery({
    queryKey: ["tasks", "all"],
    queryFn: () => taskService.getTasks(),
    enabled,
  });
}

// ==========================================
// MUTATIONS (POST, PATCH, DELETE)
// ==========================================

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTask) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTask }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}