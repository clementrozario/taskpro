import mongoose,{ Document,Schema } from "mongoose";

export interface IUser extends Document {
    email:string;
    password:string;
    role:"Admin" | "User";
}

const UserSchema = new Schema<IUser>({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role: {type:String,enum:["Admin","User"],default:"User"},
});

export default mongoose.model<IUser>("User",UserSchema);