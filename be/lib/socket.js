import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import Message from '../model/message.js'

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const onlineUsers = {};

io.on('connect',(socket)=>{
    console.log('New client connected',socket.handshake.query.name);
    const userId = socket.handshake.query._id;
    if(!onlineUsers[userId]) {
        onlineUsers[userId] = socket.id;
    }
    io.emit('getOnlineUsers', Object.keys(onlineUsers));
    socket.on('disconnect', () => {
        console.log('Client disconnected',socket.handshake.query.name);
        const userId = socket.handshake.query._id;
        if(onlineUsers[userId]) {
            delete onlineUsers[userId];
        }
        io.emit('getOnlineUsers', Object.keys(onlineUsers));
    });
})

export const sendMessage = async(req,res)=>{
    console.log('sending message wait')
    const {sender,receiver,content,image} = req.body;
    const newMessage = new Message({
        sender,
        receiver,
        content,
        image,
    });
    await newMessage.save();
    io.to(onlineUsers[receiver]).emit('getMessage', newMessage);
    return res.status(200).json({msg: 'Message sent successfully'});
}


export {app,server};