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
    useEffect(() => {
      users.sort((a,b)=>{
        const aUnread = unreadMessages[a._id]?.time || -Infinity;
        const bUnread = unreadMessages[b._id]?.time || -Infinity;
        return new Date(bUnread) - new Date(aUnread);
      })
    
    }, [unreadMessages])
    
    
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
                          unreadMessages[user._id]?.count > 0 &&(
                            console.log(unreadMessages[user._id]),
                            console.log('unreadMessages',unreadMessages),
                            <span>{unreadMessages[user._id]?.count}unreadMessage</span>
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
