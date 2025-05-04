import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { getAllHistory, getHistoryById } from '../controllers/history-controller';

const historyRouter = Router();

historyRouter.get("/all",authenticate,getAllHistory)
historyRouter.get("/:id",authenticate,getHistoryById)

export default historyRouter;