import { Router } from "express";
import { TransactionsController } from "../controller/transactionsController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

const transactionsRoutes = Router();
const transactionsController = new TransactionsController();

transactionsRoutes.use(ensureAuthenticated)

transactionsRoutes.post("/", transactionsController.create);
transactionsRoutes.get("/", transactionsController.index);
transactionsRoutes.put("/:id", transactionsController.update);

export { transactionsRoutes };