import { verifyToken } from "../lib/jwt.js";
import jwt from 'jsonwebtoken';
import user from "../model/user.js";


export const getUser = async(req,res)=>{
    const allUsers = await user.find({}, '-password -__v');
    if(allUsers.length > 0){
        return res.status(200).json(allUsers);
    } else {
        return res.status(404).json({msg: 'No users found'});
    }
}

export const updateProfile = async (req, res) => {

    const { username, email,password } = req.body;
    const token = req.cookies.token;

    if (!verifyToken(token)) {
        return res.status(401).json({success: false, msg: 'Not authorized' });
    }

    const userToken = jwt.verify(token, process.env.secrete);
    const Tuser = await user.findById(userToken.id);

    if (!Tuser) {
        return res.status(404).json({ success: false, msg: 'User not found' });
    }

    Tuser.username = username || Tuser.username;
    Tuser.email = email || Tuser.email;
    Tuser.password = password || Tuser.password;

    await Tuser.save();
    
    return res.status(200).json({ success: true, user: Tuser });
}
