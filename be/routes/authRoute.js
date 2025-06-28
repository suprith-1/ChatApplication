import express from 'express';
import { login, signin, logout, verify } from '../controller/auth.js';

const authRouter = express.Router();

authRouter.post('/signin',signin);

authRouter.post('/logout',logout);

authRouter.post('/login',login);

authRouter.get('/verify', verify);


export default authRouter;
