import express from "express";
import { addComment, getComments } from "../controllers/commentController";
import { authenticateJWT } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { Response, NextFunction } from "express";


const router = express.Router();

const wrap =
  (fn: (req: AuthRequest, res: Response, next: NextFunction) => any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    fn(req as AuthRequest, res, next);

router.post("/:taskId",authenticateJWT,wrap(addComment));

router.get("/:taskId",authenticateJWT,wrap(getComments));

export default router;