import User from "../models/User";
import Project from "../models/Project";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";
import { Response } from "express";

// displaying all users:

export const getAllUsers = async (req:AuthRequest,res:Response) => {
    try{
        if(req.user?.role != "Admin") {
            res.status(403).json({message:"Only admin are allowed to view"});
        }
        const users = await User.find().select('-password');
        res.json(users);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

// Delete user
export const deleteUser = async(req:AuthRequest,res:Response)=>{
    try{
        if(req.user?.role !== "Admin"){
            res.status(403).json({message:"only admin can delete users"});
        }
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({message:"user not found"});
            return;
        }
        res.json({message:"user deleted"})
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

// Platform stats:

export const platformStats = async (req:AuthRequest,res:Response) => {
    try{
        if(req.user?.role !== "Admin"){
            res.status(403).json({message:"only admin is allowed to view"});
        }
        const userCount = await User.countDocuments();
        const projectCount = await Project.countDocuments();
        const taskCount = await Task.countDocuments();

        res.json({users:userCount,projects:projectCount,tasks:taskCount});

    }catch{
        res.status(500).json({message:'server error'});
    }
}