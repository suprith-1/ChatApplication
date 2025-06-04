import React from 'react'
import { useEffect } from 'react';
import profile from '../assets/profile.png'
import { useStore } from '../store/user';

const ChatSideBar = () => {
    const {users,getUsers,setChatSelectedUser,onlineUsers,user:currentuser,unreadMessages,getUnreadMessages} = useStore();
    useEffect(() => {
      getUsers();
      getUnreadMessages();
    }, [])
    
  return (
    <div className=' p-3 flex flex-col gap-2.5 h-full overflow-y-scroll'>
      {
        users.map((user,i)=>{
            return (
                user._id!==currentuser._id && <div key={i} 
                className='flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer border-amber-500 '
                onClick={()=>{setChatSelectedUser(user)}}
                >
                    <img src={user.profile || profile} alt="profile" className='w-15 h-15 rounded-full' />
                    <div className='flex flex-col'>
                        <span className={`font-semibold text-lg ${onlineUsers.includes(user._id)?'text-green-500':'text-red-500'}`}>{user.username}</span>
                        <span className='font-light text-sm' > {onlineUsers.includes(user._id)?'online':'offline'}</span>
                        {
                          unreadMessages[user._id] > 0 &&(
                            <span>{unreadMessages[user._id]}unreadMessage</span>
                          )
                        }
                    </div>
                </div>
            )
        })
      }
    </div>
  )
}

export default ChatSideBar
