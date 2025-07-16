import { AccessToken } from "livekit-server-sdk";
import dotenv from 'dotenv';
dotenv.config();


const api_key = process.env.lk_api_key;
const secret_key = process.env.lk_secret_key;


export const getToken =  async(req,res)=>{
    console.log(req.body);
    const {sender,receiver,username} = req.body;
    const at = new AccessToken(api_key,secret_key,{
        identity:username,
        ttl: '100m',
    })
    at.addGrant({roomJoin:true,room:sender+receiver});
    const token = await at.toJwt();
    console.log('creating token with room ',sender+receiver)
    return res.status(200).send(token);
}