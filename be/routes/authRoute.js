import express from 'express';
import { login, signin, logout, verify } from '../controller/auth.js';

const authRouter = express.Router();

authRouter.post('/signin',(req,res)=>{signin(req,res)});

authRouter.post('/logout',(req,res)=>{logout(req,res)});

authRouter.post('/login',(req,res)=>{login(req,res) });

authRouter.get('/verify', (req,res)=>{verify(req,res) });


export default authRouter;
