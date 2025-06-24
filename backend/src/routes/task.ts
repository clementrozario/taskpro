import express from "express";
import { createTask,updateTask,deleteTask,getAllTasks } from "../controllers/taskController";
import { authenticateJWT } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { Response, NextFunction } from "express";

const router = express.Router();

const wrap =
  (fn: (req: AuthRequest, res: Response, next: NextFunction) => any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    fn(req as AuthRequest, res, next);

router.post("/",authenticateJWT,wrap(createTask));
router.put("/:id",authenticateJWT,wrap(updateTask));
router.delete("/:id",authenticateJWT,wrap(deleteTask));
router.get("/", authenticateJWT, wrap(getAllTasks));

export default router;