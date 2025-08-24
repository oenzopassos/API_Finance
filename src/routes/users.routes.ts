import { Router } from "express";
import { UsersController } from "@/controller/usersController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

const userRouter = Router();
const usersController = new UsersController();

userRouter.post("/", usersController.create);
userRouter.put("/", ensureAuthenticated ,usersController.update);

export { userRouter };