import { Request,Response } from "express";
import Task from "../models/Task"

//create:
export const createTask =  async (req:Request,res:Response):Promise<void> => {
    try{
        const { title,description } = req.body;
        const task = new Task({title,description});
        await task.save();
        res.status(201).json(task);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};

// edit:
export const updateTask = async (req:Request,res:Response):Promise<void> => {
    try{
        const { id } = req.params;
        const {title,description} = req.body;
        const task = await Task.findByIdAndUpdate(id,{title,description},{new:true});
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
export const deleteTask = async(req:Request,res:Response):Promise<void> => {
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