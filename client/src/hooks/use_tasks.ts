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
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "user", newTask.userId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTask }) =>
      taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", updatedTask.id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "user", updatedTask.userId] });
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