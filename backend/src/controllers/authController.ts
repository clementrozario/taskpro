import { Request,Response } from "express";
import bcrypt from 'bcryptjs'
import User from '../models/User';

export const signup = async (req:Request,res:Response):Promise<void> => {
    const { email,password } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            res.status(400).json({message:'User already exists'});
            return 
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({email,password:hashedPassword});
        await user.save();

        res.status(201).json({message:'User Created'});
    }catch(error){
        res.status(500).json({message:"Server error"});
    };
};