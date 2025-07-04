import { Response } from "express";
import Project from "../models/Project";
import { AuthRequest } from "../middleware/auth";
import { io } from "../app";

export const createProject = async (req:AuthRequest,res:Response):Promise<void> =>{
    try{
        if (req.user?.role !== "Admin") {
        res.status(403).json({ message: "Only admin can create projects" });
        return;
        }

        const { name,description } = req.body;
        const owner = req.user?.userId;

        const project = new Project({name,description,owner});
        await project.save();
        io.emit('projectCreated',project);
        res.status(201).json(project);
        return;
    }catch(error){
        res.status(500).json({message:'server error'});
    }
};

export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find().sort({createdAt:-1})
        res.json(projects);
    }catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}