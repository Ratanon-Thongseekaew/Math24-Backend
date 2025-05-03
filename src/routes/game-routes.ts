import { Router } from 'express';
import {generateNumbers} from '../controllers/game-controller';
import { authenticate } from '../middlewares/authenticate';
const gameRouter = Router();

gameRouter.get('/generate-numbers',authenticate,generateNumbers);


export default gameRouter