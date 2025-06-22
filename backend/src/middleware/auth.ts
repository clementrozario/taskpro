import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user:{ userId:string; role:string };
}

export const authenticateJWT = (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message:"No token"});

    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as {
            userId:string;
            role:string;
        };
        (req as AuthRequest).user = decoded;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"});
    }
};

export const authorizeRoles = (...roles:string[]) => {
    return (req:AuthRequest,res:Response,next:NextFunction) => {
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message:"Forbidden"});
        }
        next();
    };
};

