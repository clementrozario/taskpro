import { Response } from "express";
import Comment from "../models/Comment";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";
import { io } from "../app";
import User from "../models/User";
import { logActivity } from "../utils/logActivity";

export const addComment = async (req:AuthRequest,res:Response):Promise<void> => {
    try{
        
        if (req.user?.role !== "Admin") {
            res.status(403).json({ message: "Only admin can comment on tasks" });
            return;
        }

        const { taskId } = req.params;
        const { text } = req.body;
        const userId = req.user?.userId;

        if(!text ) {
            res.status(400).json({message:'comment text is needed'});
            return;
        }

        const task = await Task.findById(taskId);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        
        const comment = new Comment ({ task:taskId,user:userId,text });
        await comment.save();

        await logActivity({
            project:task.project.toString(),
            user:userId,
            action:"added comment",
            details:`comment: ${comment.text}`
        });

        const populatedComment = await comment.populate("user", "email role");
        
        io.emit('commentAdded',populatedComment);
        res.status(201).json(comment);

    }catch(error){
         console.log(error)
        res.status(500).json({message:'Server Error'})
    }
}

export const getComments = async (req:AuthRequest,res:Response):Promise<void>=>{
    try{
        const {taskId} = req.params;
        const comment = await Comment.find({task:taskId}).populate("user","email role");
        res.json(comment);
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Server Error"});
    }
}