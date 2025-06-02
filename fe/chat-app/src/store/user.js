import { create } from 'zustand';

import {io} from 'socket.io-client';

const url = 'http://localhost:5555'

export const useStore = create((set,get) => ({

  users:[],
  chatSelectedUser:null,
  setChatSelectedUser: async(user) => {
    set({ chatSelectedUser: user });
    try {
      const response = await fetch(`http://localhost:5555/api/getAllMessages`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sender: get().user?._id,
          receiver: user._id,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      get().setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  getUsers: async()=>{
      try {
          const response = await fetch('http://localhost:5555/api/users');
          const data = await response.json();
          set({ users: data });
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  },



  user: null,
  isLogin: false,
  setUser: () => {
    fetch('http://localhost:5555/auth/verify',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
            const {_id, username, email, password, createdAt, updatedAt } = data.user;

            const userData = {
              _id,
              username,
              email,
              password,
              createdAt,
              updatedAt
            };
          set({ user: userData, isLogin: true });
          // get().connect();
        } else {
          set({ user: null, isLogin: false });
        }
      })
      .catch((err) => {
        console.error('Verification error:', err);
        set({ user: null, isLogin: false });
      });
  },


  
  messages: [],

  setMessages: (messages) => {
    set({ messages });
  },
  addMessage: (message)=>{
    set(state => ({ messages: [...state.messages, message] }));
    console.log('Message added:', message);
  },

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  socket: null,
  connect:()=>{
    const socket = io(url,{
      withCredentials: true,
      query:{
        _id: get().user?._id,
        name: get().user?.username,
      },
    });
    set({socket});
    get().socket.on('getOnlineUsers',(users)=>{
      console.log('Online users received:', users);
      get().setOnlineUsers(users);
      console.log('Online users:', users);
    })
    get().socket.on('getMessage',(newMessage)=>{
      if(get().chatSelectedUser && get().chatSelectedUser._id !== newMessage.sender){
        console.log('New message from another user:', newMessage);
        return;
      }
      // console.log('New message received:', message);
      set(state => ({ messages: [...state.messages, newMessage] }));
      console.log('updated message',get().messages);
    })
  },
  disconnect:()=>{
    if(get().socket){
      get().socket.disconnect();
      set({socket: null});
    }
  },

}));

