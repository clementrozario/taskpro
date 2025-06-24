import express from "express";
import { createTask,updateTask,deleteTask } from "../controllers/taskController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.post("/",authenticateJWT,createTask);
router.put("/:id",authenticateJWT,updateTask);
router.delete("/:id",authenticateJWT,deleteTask);

export default router;