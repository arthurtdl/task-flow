import { Router } from 'express';
import AuthController from './auth_controller';
import { validate } from '../../middlewares/validade.middleware';
import { loginSchema } from './DTOs/login_dto';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/me', AuthController.me);

export default authRouter;