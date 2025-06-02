import mongoose from 'mongoose'


const connectDB = async () => {
    await mongoose.connect(process.env.db_url);
    console.log('MongoDB connected...');
}

export default connectDB;
