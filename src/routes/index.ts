import { Router } from "express";
import { userRouter } from "./users.routes";
import { sessionsRoutes } from "./sessions.routes";
import { transactionsRoutes } from "./transactions.routes";
const routes = Router();

routes.use("/users", userRouter)
routes.use("/sessions", sessionsRoutes);
routes.use("/transactions", transactionsRoutes);

export { routes };