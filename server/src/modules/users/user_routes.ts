import { Router } from 'express';
import UsersController from './user_controller';
import { validate } from './../../middlewares/validade.middleware';
import { createUserSchema } from './DTOs/create_user_dto';

const userRouter = Router();

userRouter.post('/', validate(createUserSchema), UsersController.create);
userRouter.get('/:email', UsersController.getUserByEmail);

export default userRouter;