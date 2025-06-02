import user from "../model/user.js"


export const getUser = async(req,res)=>{
    const allUsers = await user.find({}, '-password -__v');
    if(allUsers.length > 0){
        return res.status(200).json(allUsers);
    } else {
        return res.status(404).json({msg: 'No users found'});
    }
}