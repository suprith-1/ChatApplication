import { create } from 'zustand';

import {io} from 'socket.io-client';

const url = 'https://chatapp-backend-3nsr.onrender.com'

export const useStore = create((set,get) => ({
  baseUrl : url,
  users:[],
  chatSelectedUser:null,
  setChatSelectedUser: async(user) => {
    set({ chatSelectedUser: user });
    if(user===null){
      set({ messages: [] });
      return;
    }
    try {
      const response = await fetch(`${url}/api/getAllMessages`,{
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
          const response = await fetch(`${url}/api/users`);
          const data = await response.json();
          set({ users: data });
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  },



  user: null,
  isLogin: false,
  setUser: () => {
    fetch(`${url}/auth/verify`,{
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

  getUnreadMessages: async()=>{
    try {
      const response = await fetch(`${url}/api/getUnreadMessages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver: get().user?._id }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      for(const message of data){
        get().addUnreadMessages({
          userId: message.sender,
          count: 1,
          time:message.createdAt
        });
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  },
  
  messages: [],
  unreadMessages:{},
  addUnreadMessages:({userId,count,time})=>{
    const current = get().unreadMessages[userId]?.count || 0;
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [userId]: {count : current + count,time:time || new Date().toISOString()},
      },
    }));
  },
  removeUnreadMessages: async (userId) => {
    if(get().unreadMessages[userId]){
      const updatedUnreadMessages = { ...get().unreadMessages };
      delete updatedUnreadMessages[userId];
      set({ unreadMessages: updatedUnreadMessages });
      const response = await fetch(`${url}/api/removeUnreadMessages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver: get().user?._id, sender: userId }),
        credentials: 'include',
      })
      if (!response.ok) {
        console.error('Failed to remove unread messages:', response.statusText);
      } else {
        console.log('Unread messages removed successfully');
      }
    }
  },

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
  typing: false,
  setTyping: (typing) => set({ typing }),
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
      if(get().chatSelectedUser && get().chatSelectedUser._id === newMessage.sender){
        set(state => ({ messages: [...state.messages, newMessage] }));
        get().socket.emit('seenMessage',newMessage);
        console.log('updated message',get().messages);
        return;
      }
      get().addUnreadMessages({userId:newMessage.sender,count:1});
      console.log('New message received:', newMessage.sender);
      // console.log('New message received:', message);
    })
    get().socket.on('newUser',(user)=>{
      console.log('New user added:', user);
      set({users : [...get().users,user]});
      console.log('Updated users:', get().users);
    })
    get().socket.on('typing',(sender)=>{
      if(get().chatSelectedUser && get().chatSelectedUser._id !== sender){
        console.log('Typing event received from another user:', sender);
        return;
      }
      console.log('Typing event received from:', sender);
      set({typing:true});
      
    })
    get().socket.on('stopTyping',(sender)=>{
      set({typing:false});
    })
    get().socket.on('seenMessage',(newMessage)=>{
      console.log('newMessage',newMessage);
        const updated = get().messages.map((msg) => {
            if (msg._id === newMessage._id) {
                console.log('Message seen:', msg.content);
                return { ...msg, seen: true };
            }
            return msg;
        });
        console.log('messages Updated seen');
        get().setMessages(updated);
        console.log('Updated messages:', updated);
    })
    get().socket.on('allMessagesSeen',()=>{
      console.log('all messages seen event received');
      if(get().chatSelectedUser){
        const updated = get().messages.map((mas)=>{
          return {...mas, seen: true};
        })
        get().setMessages(updated);
      }
    })
  },
  disconnect:()=>{
    if(get().socket){
      get().socket.disconnect();
      set({socket: null});
    }
  },

}));

