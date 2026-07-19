import { Router } from 'express';
import TasksController from './task_controller';
import { validate } from '../../middlewares/validade.middleware';
import { createTaskSchema } from './DTOs/create_task_dto';
import { updateTaskSchema } from './DTOs/update_task_dto';

const taskRouter = Router();

taskRouter.post('/', validate(createTaskSchema), TasksController.create);
taskRouter.get('/', TasksController.getAllTasks);
taskRouter.get('/user/:userId', TasksController.getTasksByUserId);
taskRouter.get('/:id', TasksController.getTaskById);
taskRouter.patch('/:id', validate(updateTaskSchema), TasksController.update);
taskRouter.delete('/:id', TasksController.delete);

export default taskRouter;