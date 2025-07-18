import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile:{type:String }
},{timestamps: true});

const user = mongoose.model("user",userSchema); 

export default user;