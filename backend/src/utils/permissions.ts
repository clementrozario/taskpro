import { AuthRequest } from "../middleware/auth";
import Task from "../models/Task";

export const isAdmin = (req:AuthRequest) => req.user?.role === 'Admin';

export const isTaskCreator = async (req:AuthRequest,taskId:string) => {
    const task = await Task.findById(taskId);
    return task && task.createdBy.toString() === req.user?.userId;
}

export const isTaskAssignee = async (req:AuthRequest,taskId:string)=>{
    const task = await Task.findById(taskId);
    return task && task.assignee?.toString() === req.user?.userId; 
}

