import { Request,Response } from "express";
import bcrypt from 'bcryptjs'
import User from '../models/User';
import jwt from 'jsonwebtoken';

export const signup = async (req:Request,res:Response):Promise<void> => {
    const { email,password,role } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            res.status(400).json({message:'User already exists'});
            return 
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({email,password:hashedPassword,role});
        await user.save();

        res.status(201).json({message:'User Created'});
    }catch(error){
        res.status(500).json({message:"Server error"});
    };
};

export const login = async (req:Request,res:Response) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message:'Invalid Credentials'});
            return;
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({message:'Invalid credentials'});
            return;
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET as string,{expiresIn:'1d'});
        res.json(token);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};