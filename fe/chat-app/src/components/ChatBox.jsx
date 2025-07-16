import React, { useLayoutEffect } from 'react'
import profile from '../assets/profile.png'
import { useState } from 'react';
import { useStore } from '../store/user';
import { useRef } from 'react';
import { useEffect } from 'react';
import typingGif from '../assets/typing2.gif';
import callingRingtone from '../assets/callingRingtone.mp3';
import { MdOutlineVideoCall, MdPhoneMissed } from "react-icons/md";
import { FiPhoneOff } from "react-icons/fi";
import { LuPhoneCall } from "react-icons/lu";

const ChatBox = () => {
    const {chatSelectedUser,setChatSelectedUser,messageLoading,messages,user:currUser,addMessage,baseUrl,typing,socket,setTyping,removeUnreadMessages,unreadMessages,setOutgoingCall,setCallingRingRingtone} = useStore();
    const user = chatSelectedUser;
    const [typingMessage,setTypingMessage] = useState("");
    const end = useRef(null);
    const input = useRef(null);
    const callingRingRingtone = useRef(null);

    useEffect(() => {
        if (input.current) {
            input.current.focus();
        }
        if(chatSelectedUser && unreadMessages[chatSelectedUser._id]){
            removeUnreadMessages(chatSelectedUser._id);
        }
        setTyping(chatSelectedUser===currUser);
        setTypingMessage(null);
    }, [chatSelectedUser])

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
        callingRingRingtone.current.loop=true;
        setCallingRingRingtone(callingRingRingtone.current);
    },[callingRingRingtone.current,setCallingRingRingtone]);

    useEffect(() => {
        end.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages,typing]);

    const handleSendMessage = async()=>{
        if(typingMessage.trim() === "") return;
        setTypingMessage("");
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
        const res = await fetch(`${baseUrl}/api/sendMessage`, {
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

    const  handleInitiateCall = async() =>{
        callingRingRingtone.current.currentTime=0;
        callingRingRingtone.current.play();
        console.log('Initiating call to', user.username);
        setOutgoingCall({sender:currUser._id,username:user.username,receiver:user._id,isAccepted:false});
        socket.emit('initiateCall', { receiver: user._id, sender: currUser._id,senderName:currUser.username });
    }

    


  return (
    <div className='h-full gap-1.5 w-full flex flex-col justify-around bg-[var(--bg-color)] text-[var(--text-color)]'
        onKeyDown={(e) => {
            if(e.key === 'Enter'){
                handleSendMessage();
            }
            if(e.key==='escape'){
                setChatSelectedUser(null);
            }
        }}
    >
        <div className='flex items-center justify-between p-3 border-b border-[var(--text-color)]'>
            <div className='flex items-center gap-2'>
                <img src={user.profile || profile} alt="profile" className='w-12 h-12 rounded-full' />
                <div className='flex flex-col'>
                    <span className='font-semibold text-2xl'>{user.username}</span>
                </div>
            </div>
            <div className='flex items-center gap-20 text-2xl'>
                <div className='text-cyan-400 text-6xl font-bold hover:cursor-pointer hover:bg-gray-400 rounded-full w-12 h-12 flex justify-center items-center' onClick={handleInitiateCall}>
                    <MdOutlineVideoCall className="text-cyan-400 text-4xl hover:cursor-pointer hover:bg-gray-400 rounded-full" />
                </div>
                <div
                onClick={()=>setChatSelectedUser(null)}
                className='text-xl cursor-pointer hover:text-red-500 hover:scale-x-105 transition duration-20 mr-5'
                >
                    X
                </div>
            </div>
        </div>

        <div className='overflow-y-auto custom-scrollbar flex-1 p-3 flex flex-col gap-2.5 h-full'>
            {
                messages.map((message,i)=>{
                    return message.sender === currUser._id ? (
                        <div key={i} style={{backgroundColor: message.isCall?(message.content==='Call Accepted'?'green':'#f75555'):'var(--primary-color)'}} className='text-white p-2 h-auto rounded-lg shadow-md max-w-xl self-end'>
                            <div className='flex items-center gap-2'>
                                {message.isCall ? message.content==='Call Accepted'? <LuPhoneCall/> : <FiPhoneOff/>: null}
                                {message.content}
                            </div>
                            <div className='font-light flex w-full gap-1 content-end-safe'>
                                <div style={{ fontSize: '15px' }}>{new Date(message.createdAt).getHours()}:{new Date(message.createdAt).getMinutes()}</div>
                                <div className={`text-lg  ${message.seen ? 'text-green-400' : 'text-white'}`}>
                                    <span className="inline-block" style={{ letterSpacing: `${message.seen?'-8px':'0px'}` }}>
                                        {message.seen ? '✓✓' : '✓'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ):(
                        <div key={i} style={{backgroundColor: message.isCall?(message.content==='Call Accepted'?'green':'#f75555'):'var(--secondary-color)'}} className='text-[var(--text-color)] p-2 h-auto rounded-lg shadow-md max-w-xl self-start'>
                            <div className='flex items-center gap-2'>
                                {message.isCall && message.content==='Call Rejected' && <FiPhoneOff/>}
                                {message.isCall && message.content==='Call Aborted' && <MdPhoneMissed/>}
                                {message.isCall && message.content==='Call Accepted' && <LuPhoneCall/>}
                                {message.isCall && message.content==='Call Aborted'?'Missed Call':message.content}
                            </div>
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

        <div className='flex w-full justify-around'>
            <input 
            autoCorrect='off'
            autoComplete='off'
            autoCapitalize='off'
            placeholder='Type your message here...'
            className='w-4xl p-2 border border-[var(--text-color)] bg-transparent rounded-lg focus:outline-none text-[var(--text-color)]' 
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
            value={typingMessage||""}
            ></input>
            <button className='bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg ml-2 hover:bg-[var(--hover-color)] transition duration-200'
            onClick={()=>handleSendMessage()}
            >Send</button>
        </div>
        <audio className='hidden' src={callingRingtone} ref={callingRingRingtone}></audio>
    </div>
  )
}

export default ChatBox
