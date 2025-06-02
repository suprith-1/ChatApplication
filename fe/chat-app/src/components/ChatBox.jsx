import React from 'react'
import profile from '../assets/profile.png'
import { useState } from 'react';
import { useStore } from '../store/user';
import { useRef } from 'react';
import { useEffect } from 'react';

const ChatBox = () => {
    const {chatSelectedUser,setChatSelectedUser,messages,user:currUser,addMessage} = useStore();
    const user = chatSelectedUser;
    const [typingMessage,setTypingMessage] = useState("");
    const end = useRef(null);

    useEffect(()=>{
        if(end.current){
            end.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
    , [messages]);

    const handleSendMessage = async()=>{
        if(typingMessage.trim() === "") return;
        const newMessage = {
            sender:currUser._id,
            receiver:user._id,
            content:typingMessage,
            image:null,
        }
        const res = await fetch('http://localhost:5555/api/sendMessage', {
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
        console.log('Message sent:', data);
        addMessage(newMessage);
        setTypingMessage(""); 
    }

  return (
    <div className='h-full gap-1.5 w-full flex flex-col justify-around bg-gray-100'
        onKeyDown={(e) => {
            if(e.key === 'Enter'){
                handleSendMessage();
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
                        </div>
                    ):(
                        <div key={i} className='bg-white p-2 h-auto rounded-lg shadow-md max-w-xl self-start'>
                                <span className='font-semibold'></span> {message.content}
                        </div>
                    )
                    
                })
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
            onChange={(e)=>{setTypingMessage(e.target.value)}} 
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
