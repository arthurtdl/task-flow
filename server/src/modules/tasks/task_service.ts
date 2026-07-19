import TaskRepository from './task_repository';
import UserRepository from '../users/user_repository';
import { CreateTaskDTO } from './DTOs/create_task_dto';
import { UpdateTaskDTO } from './DTOs/update_task_dto';
import { HttpException } from './../../middlewares/httpException';

class TaskService {
  async createTask(data: CreateTaskDTO) {

    // Verify if the user exists before creating a task
    const userExists = await UserRepository.getUserById(data.userId);
    if (!userExists) {
      throw new HttpException(404, 'User not found. Cannot create task.');
    }

    const task = await TaskRepository.createTask(data);
    return task;
  }

  async getTaskById(id: string) {
    const task = await TaskRepository.getTaskById(id);
    if (!task) {
      throw new HttpException(404, 'Task not found.');
    }
    return task;
  }

  async getTasksByUserId(userId: string) {
    // Verify if the user exists before fetching tasks
    const userExists = await UserRepository.getUserById(userId);
    if (!userExists) {
      throw new HttpException(404, 'User not found.');
    }

    const tasks = await TaskRepository.getTasksByUserId(userId);
    return tasks;
  }

  async getAllTasks() {
    const tasks = await TaskRepository.getAllTasks();
    return tasks;
  }

  async updateTask(id: string, data: UpdateTaskDTO) {
    const taskExists = await TaskRepository.getTaskById(id);
    if (!taskExists) {
      throw new HttpException(404, 'Task not found.');
    }

    const updatedTask = await TaskRepository.updateTask(id, data);
    return updatedTask;
  }

  async deleteTask(id: string) {
    const taskExists = await TaskRepository.getTaskById(id);
    if (!taskExists) {
      throw new HttpException(404, 'Task not found.');
    }

    await TaskRepository.deleteTask(id);
  }
}

export default new TaskService();