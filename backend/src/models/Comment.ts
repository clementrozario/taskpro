import mongoose,{ Document,Schema } from "mongoose";

export interface IComment extends Document {
    task: mongoose.Types.ObjectId;
    user:mongoose.Types.ObjectId;
    text:String;
    createdAt:Date;
}

const CommentSchema = new Schema<IComment>(
    {
        task:{ type:Schema.Types.ObjectId,ref:"Task",required:true},
        user: { type:Schema.Types.ObjectId,ref:"User",required:true},
        text: {type:String,required:true},    
    },
    { timestamps:{ createdAt:true,updatedAt:false}}
)

export default mongoose.model<IComment>("Comment",CommentSchema);