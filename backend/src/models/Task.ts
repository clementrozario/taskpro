import mongoose,{Document,Schema} from "mongoose";


export interface ITask extends Document{
    title:string;
    description?:string;
    status:"To Do" | "In Progress" | "Done";
    assignee?:mongoose.Types.ObjectId;
    project:mongoose.Types.ObjectId;
    deadline?:Date;
    priority?:"Low" | "Medium" | "High";
    tags?:  string[];
    createdBy:mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
    {
        title:{type:String,required:true},
        description:{type:String},
        status: {
            type:String,
            enum:["To Do","In Progress","Done"],
            default:"To Do",
        },
        assignee:{type:Schema.Types.ObjectId,ref:"User"},
        project:{type:Schema.Types.ObjectId,ref:"Project",required:true},
        deadline:{type:Date},
        priority:{type:String,enum:["Low","Medium","High"],default:"Medium"},
        tags:[{type:String}],
        createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
    },
    { timestamps:true }
);

export default mongoose.model<ITask>("Task",TaskSchema);
