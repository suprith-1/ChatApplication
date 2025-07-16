import express from 'express';
import { getUser,updateProfile } from '../controller/user.js';
import { sendMessage } from '../lib/socket.js';
import { getAllMessage, getUnreadMessages, removeUnreadMessages } from '../controller/message.js';
import { uploadProfilePhoto } from '../lib/cloudinary.js';
import { getToken } from '../lib/livekit.js';

const APIrouter = express.Router();


APIrouter.get('/users',getUser);

APIrouter.post('/sendMessage',sendMessage);

APIrouter.post('/getAllMessages',getAllMessage);

APIrouter.post('/getUnreadMessages',getUnreadMessages);

APIrouter.post('/removeUnreadMessages',removeUnreadMessages);

APIrouter.post('/updateProfile',updateProfile);

APIrouter.post('/uploadProfilePhoto',uploadProfilePhoto);

APIrouter.post('/getToken',getToken)


export default APIrouter;