import express from 'express';
import { createProject,getAllProjects } from '../controllers/projectController';
import { authenticateJWT } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { Response, NextFunction } from 'express';


const router = express.Router();

const wrap =
  (fn: (req: AuthRequest, res: Response, next: NextFunction) => any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    fn(req as AuthRequest, res, next);

router.post("/",authenticateJWT,wrap(createProject));
router.get("/", authenticateJWT, wrap(getAllProjects));

export default router;