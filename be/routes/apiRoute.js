import express from 'express';
import { getUser } from '../controller/user.js';
import { sendMessage } from '../lib/socket.js';
import { getAllMessage } from '../controller/message.js';

const APIrouter = express.Router();


APIrouter.get('/users',getUser);
APIrouter.post('/sendMessage',sendMessage);
APIrouter.post('/getAllMessages',getAllMessage)


export default APIrouter;