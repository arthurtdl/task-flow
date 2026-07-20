import { Router } from 'express';
import AuthController from './auth_controller';
import { validate } from '../../middlewares/validade.middleware';
import { loginSchema } from './DTOs/login_dto';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), AuthController.login);

export default authRouter;