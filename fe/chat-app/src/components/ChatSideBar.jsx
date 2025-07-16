import React, { useEffect, useState } from 'react'
import profile from '../assets/profile.png'
import { useStore } from '../store/user';
import OnlineToggle from './OnlineToggle';

const ChatSideBar = () => {
  const { users, getUsers, setChatSelectedUser, onlineUsers, user: currentuser, unreadMessages, getUnreadMessages } = useStore();
  const [filteredUsers,setFilteredUsers] = useState([]);
  const [onlineToggle,setOnlineToggle] = useState(false);



  useEffect(() => {
    getUsers();
    getUnreadMessages();
  }, [])
  
  useEffect(()=>{
    setFilteredUsers(users);
  },[users]);

  useEffect(() => {
    users.sort((a, b) => {
      const aUnread = unreadMessages[a._id]?.time || -Infinity;
      const bUnread = unreadMessages[b._id]?.time || -Infinity;
      return new Date(bUnread) - new Date(aUnread);
    })
  }, [unreadMessages])



  function handleOnlineToggle(check){
    if(check){
      setFilteredUsers(users.filter(user => onlineUsers.includes(user._id)));
    }
    else {
      setFilteredUsers(users);
    }
    setOnlineToggle(check);
  }

  function handleSearch(name){
    if(name.trim() === ""){
      if(onlineToggle){
        handleOnlineToggle(true);
        return;
      }
      setFilteredUsers(users);
      return;
    }
    const searchResult = filteredUsers.filter(user => user.username.toLowerCase().includes(name.toLowerCase()));
    setFilteredUsers(searchResult);
  }

  return (
    <div className='p-3 flex flex-col gap-2.5 h-full overflow-y-scroll bg-[var(--bg-color)] text-[var(--text-color)] custom-scrollbar'>
      <div className='flex gap-2 items-center'>
        <OnlineToggle onChange={handleOnlineToggle} />
        <input
          type='text'
          placeholder='Search...'
          onChange={(e) => handleSearch(e.target.value)}
          className='w-full px-4 py-2 rounded-lg border border-[var(--primary-color)] bg-[var(--input-bg)] text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition duration-200'
        />
      </div>
      {
        filteredUsers.map((user, i) => {
          return (
            user._id !== currentuser._id && <div key={i}
              className='flex items-center gap-2 p-2 hover:bg-[var(--hover-color)] rounded-lg cursor-pointer border-[var(--primary-color)]'
              onClick={() => { setChatSelectedUser(user) }}
            >
              <img src={user.profile || profile} alt="profile" className='w-15 h-15 rounded-full' />
              <div className='flex justify-between items-center w-full'>
                <div className='flex flex-col'>
                  <span className='font-semibold text-lg text-white'>{user.username}</span>
                  <span className={`font-light text-sm ${onlineUsers.includes(user._id) ? 'text-green-300' : 'text-red-300'}`}>
                    {onlineUsers.includes(user._id) ? 'online' : 'offline'}
                  </span>
                </div>
                {
                  unreadMessages[user._id]?.count > 0 && (
                    <div className='w-5 h-5 bg-blue-300 text-sm font-extrabold flex justify-center items-center text-black rounded-full'>{unreadMessages[user._id]?.count}</div>
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
