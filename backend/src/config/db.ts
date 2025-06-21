import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('mongoDB is connected');
    }catch(error){
        console.log(error);
        process.exit(1);
    };
};

export default connectDB;