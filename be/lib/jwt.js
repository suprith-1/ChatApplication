import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secrete = process.env.secrete;

export const newToken = (id)=>{
    const token = jwt.sign({id}, secrete, { expiresIn: '7d' });
    return token;
}

export const verifyToken = (token)=>{
    if(!token) return false;
    try {
        return jwt.verify(token, secrete);
    } catch (error) {
        return false;
    }
}
