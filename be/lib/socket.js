import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import Message from '../model/message.js'

const fe_url = 'https://chatapp-frontend-okrj.onrender.com'

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [fe_url],
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
    socket.on('typing',({receiver, sender})=>{
        io.to(onlineUsers[receiver]).emit('typing',sender);
    })
    socket.on('stopTyping',({receiver, sender})=>{
        io.to(onlineUsers[receiver]).emit('stopTyping',sender);
    })  
    socket.on('seenMessage',async (newMessage)=>{
        await Message.updateOne({_id:newMessage._id},{seen:true});
        io.to(onlineUsers[newMessage.sender]).emit('seenMessage', newMessage);
    })
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
    return res.status(200).json(newMessage);
}

export const addNewUser = (user)=>{
    io.emit('newUser', user);
}

export const allMessagesSeen = (to)=>{
    console.log('sending all messages seen to', to);
    io.to(onlineUsers[to]).emit('allMessagesSeen');
}

export {app,server};