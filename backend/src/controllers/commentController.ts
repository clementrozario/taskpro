import { Response } from "express";
import Comment from "../models/Comment";
import { AuthRequest } from "../middleware/auth";

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

        const comment = new Comment ({ task:taskId,user:userId,text });
        await comment.save();
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