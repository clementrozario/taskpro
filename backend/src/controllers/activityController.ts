import ActivityLog from "../models/ActivityLog";
import { AuthRequest } from "../middleware/auth";
import { Response } from "express";

export const getProjectActivity = async (req:AuthRequest,res:Response) => {
    try{
        const { projectId } = req.params;
        const logs = await ActivityLog.find({ project:projectId })
                .populate("user","email role")
                .sort({ createdAt:-1})
            res.json(logs);
    }catch(error){
        res.status(500).json({message:"Server error"})
    }
}