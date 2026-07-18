import { Router } from "express";
import userRouter from "../modules/users/user_routes";

const routes = Router();

// All the routes listed here will be prefixed with /api
routes.use("/users", userRouter);

export default routes;