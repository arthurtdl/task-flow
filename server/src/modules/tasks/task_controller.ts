import { Request, Response } from 'express';
import TaskService from './task_service';

class TasksController {
  
  create = async (req: Request, res: Response) => {
    const task = await TaskService.createTask(req.body);

    res.status(201).json({
      message: 'Task created successfully.',
      data: task,
    });
  };

  getTaskById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const task = await TaskService.getTaskById(id);

    res.status(200).json({
      message: 'Task retrieved successfully.',
      data: task,
    });
  };

  getTasksByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const tasks = await TaskService.getTasksByUserId(userId);

    res.status(200).json({
      message: 'User tasks retrieved successfully.',
      data: tasks,
    });
  };

  getAllTasks = async (req: Request, res: Response) => {
    const tasks = await TaskService.getAllTasks();

    res.status(200).json({
      message: 'All tasks retrieved successfully.',
      data: tasks,
    });
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updatedTask = await TaskService.updateTask(id, req.body);

    res.status(200).json({
      message: 'Task updated successfully.',
      data: updatedTask,
    });
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await TaskService.deleteTask(id);

    res.status(204).send(); 
  };
}

export default new TasksController();