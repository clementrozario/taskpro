import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';

dotenv.config();
connectDB();
console.log('Hi')
const app = express();
app.use(express.json());

app.use('/api/auth',authRoutes);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`sever is running on port ${PORT}`)
})