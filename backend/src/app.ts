import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';
import projectRoutes from "./routes/project";
import commentRoutes from "./routes/comment";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/task',taskRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/comments',commentRoutes);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})