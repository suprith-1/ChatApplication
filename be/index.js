import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import APIrouter from './routes/apiRoute.js';
import authRouter from './routes/authRoute.js';
import { app, server } from './lib/socket.js';


dotenv.config();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));

app.use('/auth',authRouter);
app.use('/api',APIrouter);


server.listen(process.env.PORT,()=>{
    console.log('server started')
    connectDB();
});
