import express from 'express';
import { getUser } from '../controller/user.js';
import { sendMessage } from '../lib/socket.js';
import { getAllMessage, getUnreadMessages, removeUnreadMessages } from '../controller/message.js';

const APIrouter = express.Router();


APIrouter.get('/users',getUser);

APIrouter.post('/sendMessage',sendMessage);

APIrouter.post('/getAllMessages',getAllMessage);

APIrouter.post('/getUnreadMessages',getUnreadMessages);

APIrouter.post('/removeUnreadMessages',removeUnreadMessages);


export default APIrouter;