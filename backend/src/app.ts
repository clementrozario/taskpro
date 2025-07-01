import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';
import projectRoutes from "./routes/project";
import commentRoutes from "./routes/comment";
import adminRoutes from './routes/admin';
import http from 'http'
import { Server } from 'socket.io'
import { initSocketIO } from './socket'
import activityRoutes from './routes/activity';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET","POST"]
    }
})
initSocketIO(io);

app.use('/api/auth',authRoutes);
app.use('/api/task',taskRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/activity',activityRoutes);

const PORT = process.env.PORT;
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

export { io };