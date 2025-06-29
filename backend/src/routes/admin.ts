import express from 'express';
import { getAllUsers,deleteUser,platformStats } from '../controllers/adminController';
import { authenticateJWT } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { Response,NextFunction } from 'express';

const router = express();

const wrap = 
    (fn:(req:AuthRequest,res:Response,next:NextFunction)=>any) => 
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
        fn(req as AuthRequest, res, next);

    router.get("/users",authenticateJWT,wrap(getAllUsers));
    router.delete("/users/:id",authenticateJWT,wrap(deleteUser));
    router.get("/stats",authenticateJWT,wrap(platformStats));

    export default router;
