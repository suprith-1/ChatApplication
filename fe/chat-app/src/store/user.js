import { create } from 'zustand';

import {io} from 'socket.io-client';

const real = 'https://chat-app-server-jbg2.onrender.com';
const local = 'http://localhost:5555';

const url = local ;

export const useStore = create((set,get) => ({
  isLoading:false,
  setLoading:(flag)=>{
    if(flag==false){
      setTimeout(() => {
        set({isLoading:flag});
      }, 500);
      return;
    }
    set({isLoading:flag});
  },
  baseUrl : url,
  users:[],
  chatSelectedUser:null,
  setChatSelectedUser: async(user) => {
    set({ chatSelectedUser: user });
    get().setMessageLoading(true);
    get().setMessages([]);
    if(user===null){
      set({ messages: [] });
      return;
    }
    try {
      get().setLoading(true);
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
      get().setMessages([]);
      console.error('Error fetching messages:', error);
    }
    get().setLoading(false);
    get().setMessageLoading(false);
  },

  getUsers: async()=>{
      try {
          get().setLoading(true);
          const response = await fetch(`${url}/api/users`);
          const data = await response.json();
          set({ users: data });
          get().setLoading(false);
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  },



  user: null,
  isLogin: false,
  setIsLogin: (flag) => {
    set({ isLogin: flag });
  },
  setUser: () => {
    get().setLoading(true);
    fetch(`${url}/auth/verify`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
            const {_id, username, email, password,profile, createdAt, updatedAt } = data.user;

            const userData = {
              _id,
              username,
              email,
              password,
              profile,
              createdAt,
              updatedAt
            };
          set({ user: userData, isLogin: true });
          // get().connect();
        } else {
          set({ user: null, isLogin: false });
        }
        get().setLoading(false);
      })
      .catch((err) => {
        console.error('Verification error:', err);
        set({ user: null, isLogin: false });
      });
  },

  getUnreadMessages: async()=>{
    try {
      get().setLoading(true);
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
    finally {
      get().setLoading(false);
    }
  },
  
  messages: [],
  messageLoading:false,
  setMessageLoading:(par)=>{
    set({messageLoading:par});
  },
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
      get().setLoading(true);
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
      get().setLoading(false);
    }
  },

  setMessages: (messages) => {
    set({ messages });
  },
  addMessage: (message)=>{
    set(state => ({ messages: [...state.messages, message] }));
    console.log('Message added:', message);
  },

  updateProfile: async (updatedUser) => {
    get().setLoading(true);
    try {
      const response = await fetch(`${url}/api/updateProfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        set({ user: data.user });
        console.log('Profile updated successfully:', data.user);
      } else {
        console.error('Profile update failed:', data.message);
      }
    } catch (error) { 
      console.error('Error updating profile:', error);
    } finally {
      get().setLoading(false);
    }
  },
  uploadProfilePhoto: async(formData)=>{
    get().setLoading(true);
    try{
      const response = await fetch(`${url}/api/uploadProfilePhoto`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          user: {
            ...state.user,
            profile: data.profile,
          },
        }));
        console.log('Profile photo updated successfully:', data.profileUrl);
      }
    }
    catch (error) {
      console.error('Error uploading profile photo:', error);
    } finally {
      get().setLoading(false);
    }
  },
  notify:null,
  setNotify: (audioRef) => {
    set({ notify: audioRef });
  },
  callRingtone:null,
  setCallRingtone:(audioRef) => {set({ callRingtone: audioRef })},
  callingRingRingtone:null,
  setCallingRingRingtone:(audioRef) => {set({ callingRingRingtone: audioRef })},
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  socket: null,
  typing: false,
  setTyping: (typing) => set({ typing }),
  incomingCall: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  outgoingCall:null,
  setOutgoingCall: (call) => set({ outgoingCall: call }),
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
      get().notify.play();
      if(newMessage.sender==get().user._id||(get().chatSelectedUser && get().chatSelectedUser._id === newMessage.sender) ){
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
      if(user._id===get().user._id) return;
      set({users : [...get().users,user]});
      console.log('Updated users:', get().users);
    })
    get().socket.on('typing',(sender)=>{
      if(get().chatSelectedUser && get().chatSelectedUser._id != sender){
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
            if (msg._id === newMessage._id || msg.isCall) {
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

    get().socket.on('initiateCall',({receiver,sender,senderName})=>{
      get().callRingtone.currentTime=0;
      get().callRingtone.play();
      const call = {
        sender,
        receiver,
        username:senderName,
      }
      get().setIncomingCall(call);
      console.log('Incoming call from:', sender);
    })
    get().socket.on('cancelInitiateCall',()=>{
      get().callRingtone.pause();
      console.log('Call cancelled');
      get().setIncomingCall(null);
      get().setOutgoingCall(null);
      get().setLkToken(null);
    })
    get().socket.on('incomingCalRejected',()=>{
      get().callingRingRingtone.pause();
      console.log('call rejected');
      get().setOutgoingCall(null);
      get().setIncomingCall(null);
      get().setLkToken(null);
    })
    get().socket.on('incomingCallAccepted',({receiver,sender})=>{
      get().outgoingCall.isAccepted=true;
      get().callingRingRingtone.pause();
      get().getLkToken({sender,receiver,username:get().user.username});
    })
    get().socket.on('rejectOutgoingCall',()=>{
      get().callingRingRingtone.pause();
      console.log('Outgoing call rejected');
      get().setOutgoingCall(null);
      get().setIncomingCall(null);
      get().setLkToken(null);
    })

  },

  disconnect:()=>{
    if(get().socket){
      get().socket.disconnect();
      set({socket: null});
    }
  },
  lkToken:null,
  setLkToken : (token)=>set({lkToken:token}),
  getLkToken: async({sender,receiver,username})=>{
    get().setLoading(true);
    try{
      const response = await fetch(`${url}/api/getToken`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({sender,receiver,username}),
      })
      if(!response.ok){
        throw new Error('Failed to get token');
      }
      const token = await response.text();
      get().setLkToken(token);
      console.log('LiveKit token received:', token);
    }
    catch (error) {
      console.error('Error fetching LiveKit token:', error);
    } finally {
      get().setLoading(false);
    }
  },

}));

