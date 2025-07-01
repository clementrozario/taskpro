import mongoose,{Document,Schema} from "mongoose";

export interface IActivityLog extends Document{
    project:mongoose.Types.ObjectId;
    user:mongoose.Types.ObjectId;
    action:string;
    details?:string;
    createdAt:Date;
}

const ActivityLogSchema =  new Schema<IActivityLog>(
    {
        project:{type:Schema.Types.ObjectId,ref:"Project",required:true},
        user:{type:Schema.Types.ObjectId,ref:"User",required:true},
        action:{type:String,required:true},
        details:{type:String},
    },
    {timestamps:{ createdAt:true,updatedAt:false}}
);

export default mongoose.model<IActivityLog>("ActivityLog",ActivityLogSchema);