import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/task',taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`sever is running on port ${PORT}`)
})