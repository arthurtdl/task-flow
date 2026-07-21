import { Router } from 'express';
import TasksController from './task_controller';
import { validate } from '@/middlewares/validade.middleware';
import { authorize } from '@/middlewares/authorize';
import { createTaskSchema } from './DTOs/create_task_dto';
import { updateTaskSchema } from './DTOs/update_task_dto';

const taskRouter = Router();

taskRouter.post('/', validate(createTaskSchema), TasksController.create);
taskRouter.get("/", authorize("ADMIN"), TasksController.getAllTasks); // Protected route (only for admin)
taskRouter.get('/user/:userId', TasksController.getTasksByUserId);
taskRouter.get('/:id', TasksController.getTaskById);
taskRouter.patch('/:id', validate(updateTaskSchema), TasksController.update);
taskRouter.delete('/:id', TasksController.delete);

export default taskRouter;