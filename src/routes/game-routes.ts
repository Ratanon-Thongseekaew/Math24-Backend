import { Router } from 'express';
import {generateNumbers, submitSolution} from '../controllers/game-controller';
import { authenticate } from '../middlewares/authenticate';
const gameRouter = Router();

gameRouter.get('/generate-numbers',authenticate,generateNumbers);
gameRouter.post('/submit-solution',authenticate,submitSolution)

export default gameRouter