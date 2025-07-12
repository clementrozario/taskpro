import { Response } from "express";
import Task from "../models/Task"
import { AuthRequest } from "../middleware/auth";
import { io } from "../app";
import mongoose from "mongoose";
import { logActivity } from "../utils/logActivity";
import { isAdmin, isTaskCreator } from "../utils/permissions";
import User from "../models/User";

//create:
export const createTask =  async (req:AuthRequest,res:Response):Promise<void> => {
    try{
        let { title,description,status,assignee,project,deadline,priority,tags } = req.body;
        const createdBy = req.user?.userId;

        if(assignee && typeof assignee === "string" && !mongoose.Types.ObjectId.isValid(assignee)){
            const user = await User.findOne({email:assignee})
            if(!user){
                res.status(400).json({message:"Assignee user is not Found"});
                return;
            }
            assignee = user._id;
        }

         if (assignee && !isAdmin(req)) {
            res.status(403).json({ message: "Only admin can assign tasks" });
            return;
        }

        const task = new Task({title,description,status,assignee,project,deadline,priority,tags,createdBy});
        await task.save();

        //activity
        await logActivity({
            project:task.project.toString(),
            user:createdBy,
            action:"created task",
            details:`Task:${task.title}`
        })

        const populatedTask = await Task.findById(task._id)
            .populate("assignee", "email role")
            .populate("createdBy", "email role")
            .populate("project", "name");

        io.emit("task-created",populatedTask);
        res.status(201).json(populatedTask);
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

        const creator = await isTaskCreator(req,id);
        if(!isAdmin(req) && !creator){
            res.status(403).json({message:'Only admin or task creator can edit the tasks'});
            return;
        }

        if(updates.assignee && !isAdmin(req)){
        res.status(403).json({ message: "Only admin can assign tasks" });
        return;
        }
        
        const task = await Task.findByIdAndUpdate(id,updates,{new:true});
        if(!task) {
            res.status(404).json({message:"Task not found"});
            return;
        }

        //Activity:
        await logActivity({
            project:task.project.toString(),
            user:req.user?.userId,
            action:"updated the task",
            details:`Task: ${task.title}`
        })

        io.emit("task-updated",task);
        res.json(task);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};

// delete:
export const deleteTask = async(req:AuthRequest,res:Response):Promise<void> => {
    try{
        if(!isAdmin(req)){
            res.status(403).json({message:"only Admin can delete the tasks"});
            return;
        }
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if(!task) {
        res.status(404).json({message:"Task not found"});
        return;
        }

        //delete activity
        await logActivity({
            project:task.project.toString(),
            user:req.user?.userId,
            action:"deleted Task",
            details:`Task: ${task.title}`
        });

        io.emit('task-deleted',task);
        res.json({message:"Task deleted"}); 
    }catch(error){
        res.status(500).json({message:"Server Error"}); 
    }
};

//all tasks
export const getAllTasks = async (req:AuthRequest,res:Response) => {
    try{
        const projectId = req.query.project as string;
        
        if(!projectId){
            res.status(400).json({message:"project ID is required"});
            return;
        }

        let {  title, tag, assignee,priority } = req.query;

        let assigneeFilter: string | mongoose.Types.ObjectId | undefined = undefined;

        if (assignee && typeof assignee === "string") {
            if (mongoose.Types.ObjectId.isValid(assignee)) {
                assigneeFilter = new mongoose.Types.ObjectId(assignee);
            } else {
            const user = await User.findOne({ email: assignee });
            if (!user) {
                res.status(400).json({ message: "Assignee user is not Found" });
                return;
            }
            assigneeFilter = user._id as mongoose.Types.ObjectId;
        }
    }

        const match: any = {
            project:new mongoose.Types.ObjectId(projectId),
        }

        if(title){
            match.title = { $regex: title as string, $options:"i"};
        }
        if(tag && typeof tag === "string"){
            match.tags = tag;
        }
        if(assigneeFilter){
            match.assignee = new mongoose.Types.ObjectId(assignee as string);
        }
        if(priority){
            match.priority = priority;
        }

        const tasks = await Task.aggregate([    
               { $match: match},

                {
                $lookup:{
                    from:"users",
                    localField:"assignee",
                    foreignField:"_id",
                    as:"assignee",
                }
            },
            { $unwind:{path:"$assignee",preserveNullAndEmptyArrays:true}},
            {
                $lookup:{
                    from:"comments",
                    localField:"_id",
                    foreignField:"task",
                    as:"comments"
                }
            },
            {
                $project:{
                    title:1,
                    description: 1,
                    status: 1,
                    project: 1,
                    assigneeEmail:"$assignee.email",
                    deadline: 1,
                    priority: 1,
                    tags: 1,
                    createdBy: 1,
                    comments:{
                        $map:{
                            input:"$comments",
                            as:"comment",
                            in:{ text: "$$comment.text"},
                        },
                    },
                },
            },
        ]);
        res.json(tasks);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};