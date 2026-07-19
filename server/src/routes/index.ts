import { Router } from "express";
import userRouter from "../modules/users/user_routes";
import taskRouter from "../modules/tasks/task_routes";
import attachmentRouter from "../modules/attachment/attachment_routes";

const routes = Router();

// All the routes listed here will be prefixed with /api
routes.use("/users", userRouter);
routes.use("/tasks", taskRouter);
routes.use("/attachments", attachmentRouter);

routes.get('/', (_, res) => {
    res.status(200).json({ message: 'Welcome to the TaskFlow API' });
})

export default routes;