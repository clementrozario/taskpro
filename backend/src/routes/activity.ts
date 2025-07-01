import express from 'express';
import { getProjectActivity } from '../controllers/activityController';
import { authenticateJWT } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { Response,NextFunction } from 'express';

const router = express.Router();

const wrap = 
    (fn:(req:AuthRequest,res:Response,next:NextFunction)=>any)=>
    (req:express.Request,res:express.Response,next:express.NextFunction)=>
        fn(req as AuthRequest,res,next)

router.get('/:projectId',authenticateJWT,wrap(getProjectActivity));

export default router;