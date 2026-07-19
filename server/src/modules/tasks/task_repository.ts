import prisma from "@database";
import { Prisma, Task } from "@prisma/client";

class TaskRepository {
  async createTask(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const task = await prisma.task.create({ data });
    return task;
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    return task;
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' } // Order tasks by creation date in descending order
    });
    return tasks;
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' } // Same descending order
    });
    return tasks;
  }

  async updateTask(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    const task = await prisma.task.update({
      where: { id },
      data,
    });
    return task;
  }

  async deleteTask(id: string): Promise<Task> {
    const task = await prisma.task.delete({
      where: { id },
    });
    return task;
  }
}

export default new TaskRepository();