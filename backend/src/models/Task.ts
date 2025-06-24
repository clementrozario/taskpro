import mongoose,{Document,mongo,Schema} from "mongoose";

export interface ITask extends Document{
    title:string;
    description?:string;
}

const TaskSchema = new Schema<ITask>(
    {
        title:{type:String,required:true},
        description:{type:String}
    },
    { timestamps:true }
);

export default mongoose.model<ITask>("Task",TaskSchema);
