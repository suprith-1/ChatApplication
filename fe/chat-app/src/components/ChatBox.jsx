import React, { useLayoutEffect } from 'react'
import profile from '../assets/profile.png'
import { useState } from 'react';
import { useStore } from '../store/user';
import { useRef } from 'react';
import { useEffect } from 'react';
import typingGif from '../assets/typing2.gif';


const ChatBox = () => {
    const {chatSelectedUser,setChatSelectedUser,messages,user:currUser,addMessage,setMessages,typing,socket,setTyping,removeUnreadMessages,unreadMessages} = useStore();
    const user = chatSelectedUser;
    const [typingMessage,setTypingMessage] = useState("");
    const end = useRef(null);
    const input = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setChatSelectedUser(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
            end.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    useEffect(() => {
        if (input.current) {
            input.current.focus();
        }
        if(chatSelectedUser && unreadMessages[chatSelectedUser._id]){
            removeUnreadMessages(chatSelectedUser._id);
        }
        setTypingMessage(null);
    }, [chatSelectedUser])


    const handleSendMessage = async()=>{
        if(typingMessage.trim() === "") return;
        socket.emit('stopTyping', { receiver: user._id, sender: currUser._id });
        const newMessage = {
            sender:currUser._id,
            receiver:user._id,
            content:typingMessage,
            image:null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            seen: false,
        }
        const res = await fetch('https://chat-app-backend-phi-three.vercel.app/api/sendMessage', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body:JSON.stringify(newMessage)
        })
        if(!res.ok){
            alert('Failed to send message');
            return;
        }
        const data = await res.json(); 
        addMessage(data);
        setTypingMessage(""); 
    }

  return (
    <div className='h-full gap-1.5 w-full flex flex-col justify-around bg-gray-100'
        onKeyDown={(e) => {
            if(e.key === 'Enter'){
                handleSendMessage();
            }
            if(e.key==='escape'){
                setChatSelectedUser(null);
            }
        }}
    >

        {/* top navbar */}
        <div className='flex items-center justify-between p-3 border-b border-gray-300'>
            <div className='flex items-center gap-2'>
                <img src={user.profile || profile} alt="profile" className='w-12 h-12 rounded-full' />
                <div className='flex flex-col'>
                    <span className='font-semibold text-2xl'>{user.username}</span>
                </div>
            </div>
            <div
            onClick={()=>setChatSelectedUser(null)}
            className='text-xl cursor-pointer hover:text-red-500 hover:scale-x-105 transition duration-20 mr-5'
            >
                X
            </div>
        </div>

        {/* chat messages */}
        <div className='overflow-y-auto flex-1 p-3 flex flex-col gap-2.5 h-full'>
            {
                messages.map((message,i)=>{
                    return message.sender === currUser._id ? (
                        <div key={i} className='bg-blue-100 p-2 h-auto rounded-lg shadow-md max-w-xl self-end'>
                            <span className='font-semibold'></span> {message.content}
                            <div className='font-light flex w-full content-end-safe'>
                                <div>{new Date(message.createdAt).getHours()}:{new Date(message.createdAt).getMinutes()}</div>
                                <div className={`${message.seen?'text-green-500':'text-black'} text-xl`}>✓</div>
                            </div>

                        </div>
                    ):(
                        <div key={i} className='bg-white p-2 h-auto rounded-lg shadow-md max-w-xl self-start'>
                                <span className='font-semibold'></span> {message.content}
                                <div className='font-light flex w-full content-end-safe'>{new Date(message.createdAt).getHours()}:{new Date(message.createdAt).getMinutes()}</div>
                        </div>
                    )
                })
                
            }
            {
                typing && (
                    <div>
                        <img  src={typingGif} className='h-13 w-20 self-start' />
                    </div>
                )
            }
            <div ref={end}></div>
        </div>

        {/* input box */}
        <div className='flex w-full justify-around'>
            <input 
            autoCorrect='off'
            autoComplete='off'
            autoCapitalize='off'
            placeholder='Type your message here...'
            className='w-4xl p-2 border border-gray-300 rounded-lg focus:outline-none ' 
            type='text' 
            ref={input}
            onChange={(e)=>{
                setTypingMessage(e.target.value);
                if(e.target.value.trim() !== "") {
                    socket.emit('typing', { receiver: user._id, sender: currUser._id });
                }
                else{
                    socket.emit('stopTyping', { receiver: user._id, sender: currUser._id });
                }
            }} 
            value={typingMessage}
            ></input>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600 transition duration-200'
            onClick={()=>handleSendMessage()}
            >Send</button>
        </div>

    </div>
  )
}

export default ChatBox
