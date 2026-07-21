import api from "./api";
import { CreateTask, Task, UpdateTask } from "@/types/task_types";

export const taskService = {
  createTask: async (data: CreateTask): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  getTasksByUserId: async (userId: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/user/${userId}`);
    return response.data.data;
  },

  updateTask: async (id: string, data: UpdateTask): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    // There's no data to 'extract'
    await api.delete(`/tasks/${id}`);
  },
};