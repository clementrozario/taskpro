import { Response } from "express";
import Task from "../models/Task"
import { AuthRequest } from "../middleware/auth";

//create:
export const createTask =  async (req:AuthRequest,res:Response):Promise<void> => {
    try{
        const { title,description,status,assignee,project,deadline,priority,tags } = req.body;
        const createdBy = req.user?.userId;

        const task = new Task({title,description,status,assignee,project,deadline,priority,tags,createdBy});
        await task.save();
        res.status(201).json(task);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
};

// edit:
export const updateTask = async (req:AuthRequest,res:Response):Promise<void> => {
    try{
        const { id } = req.params;
        const updates = req.body;

        if (updates.assignee && req.user?.role !== "Admin") 
        {
        res.status(403).json({ message: "Only admin can assign tasks" });
        return;
        }
        
        const task = await Task.findByIdAndUpdate(id,updates,{new:true});
        if(!task) {
            res.status(404).json({message:"Task not found"});
            return;
        }
        res.json(task);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

// delete:
export const deleteTask = async(req:AuthRequest,res:Response):Promise<void> => {
    try{
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if(!task) {
        res.status(400).json({message:"Task not found"});
        return;
        }
        res.json({message:"Task deleted"}); 
    }catch(error){
        res.status(500).json({message:"Server Error"}); 
    }
};

//all tasks
export const getAllTasks = async (req:AuthRequest,res:Response) => {
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};