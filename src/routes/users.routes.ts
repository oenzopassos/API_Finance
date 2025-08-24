import { Router } from "express";
import { UsersController } from "@/controller/usersController";

const userRouter = Router();
const usersController = new UsersController();

userRouter.post("/", usersController.create);

export { userRouter };