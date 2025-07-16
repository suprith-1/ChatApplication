import { newToken, verifyToken } from "../lib/jwt.js";
import { addNewUser } from "../lib/socket.js";
import user from "../model/user.js";
import jwt from 'jsonwebtoken';



export const signin = async (req, res) => {
    const {username, password, email } = req.body;
    const finduser = await user.findOne({email });
    if(finduser){
        return res.status(400).json({msg: 'User already exists'});
    }
    const newUser = new user({username, email, password});
    const token = newToken(newUser._id);
    await newUser.save();
    res.cookie('token', token,{maxAge: 7 * 24 * 60 * 60 * 1000,httpOnly: true,secure:true,sameSite: 'none'});
    addNewUser(newUser);
    return res.status(200).json({msg: 'User registered successfully'});
}

export const login = async (req, res) => {
    const {username,password} = req.body;
    const presUser = await user.findOne({username});
    if(presUser && presUser.password === password){
        const token = newToken(presUser._id);
        res.cookie('token', token,{maxAge: 7 * 24 * 60 * 60 * 1000,httpOnly: true,secure:true,sameSite: 'none'})
        return res.status(200).json({user:presUser});
    }
    return res.status(400).json({msg: 'Invalid credentials'});
}

export const logout = (req, res) => {
    const presToken = req.cookies.token;
    if(verifyToken(presToken)) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        return res.status(200).json({msg: 'User logged out successfully'});
    }
    return res.status(400).json({msg: 'No token found'});
}

export const verify = async (req,res) =>{
    console.log(req.cookies);
    const token = req.cookies.token;
    if(verifyToken(token)){
        const userToken = jwt.verify(token, process.env.secrete);
        console.log(userToken);
        const Tuser = await user.findOne({_id:userToken.id});
        console.log(Tuser);
        return res.json({user: Tuser  });
    } else {
        return res.status(401).json({msg: 'Not authorized'});
    }

}



