import prisma from "@database";
import { Prisma, Task } from "@prisma/client";

class TaskRepository {
  async createTask(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const task = await prisma.task.create({ data });
    return task;
  }

  async getTaskById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        attachments: true, // Traz todos os anexos vinculados a esta task
        user: {
          select: { name: true } // Traz apenas o nome do usuário (protege a senha)
        }
      }
    });
    return task;
  }

  async getTasksByUserId(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true,
        user: {
          select: { name: true }
        }
      }
    });
    return tasks;
  }

  async getAllTasks() {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true,
        user: {
          select: { name: true }
        }
      }
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