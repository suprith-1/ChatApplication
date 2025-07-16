import React from 'react';
import ChatSideBar from './ChatSideBar';
import NoChatBox from './NoChatBox';
import ChatBox from './ChatBox';
import { useEffect } from 'react';
import { useStore } from '../store/user';
import notifyAudio from '../assets/notify.mp3';
import incomingCallRingtone from '../assets/incomingCallRingtone.wav';
import { useRef } from 'react';
import IncomingCallPopUp from './IncomingCallPopUp';
import OutgoingCallPopUp from './OutgoingCallPopUp';
import VideoCallPage from './VideoCallPage';

const ChatPage = () => {
  const { chatSelectedUser } = useStore();
  const {connect,setNotify,incomingCall,setIncomingCall,outgoingCall,setOutgoingCall,addMessage,socket,user,getLkToken,lkToken,setLkToken,setCallRingtone,callingRingRingtone} = useStore();
  const notifyRef = useRef(null)
  const callRingtone = useRef(null);

  useEffect(() => {
    connect();
    setNotify(notifyRef.current);
    callRingtone.current.loop=true;
    setCallRingtone(callRingtone.current);
  }, []);
  

  const acceptIncomingCall = async()=>{
    const msg = {
      sender:incomingCall.sender,
      receiver:incomingCall.receiver,
      content: 'Call Accepted',
      isCall:true,
      createdAt : new Date().toISOString(),
      updatedAt : new Date().toISOString(),
    }
    addMessage(msg);
    callRingtone.current.pause();
    setOutgoingCall(incomingCall);
    socket.emit('incomingCallAccepted',incomingCall);
    getLkToken({sender:incomingCall.sender,receiver:incomingCall.receiver,username:user.username});
    setIncomingCall(null);
  }
  const rejectIncomingCall = async()=>{
    const msg = {
      sender:incomingCall.sender,
      receiver:incomingCall.receiver,
      content: 'Call Rejected',
      isCall:true,
      createdAt : new Date().toISOString(),
      updatedAt : new Date().toISOString(),
    }
    addMessage(msg)
    callRingtone.current.pause();
    console.log('Rejecting call');
    socket.emit('incomingCalRejected',incomingCall);
    setIncomingCall(null);
  }

  const rejectOutgoingCall =  async()=>{
    if(outgoingCall.sender===user._id){
      if(!outgoingCall.isAccepted){
        const msg = {
          sender:outgoingCall.sender,
          receiver:outgoingCall.receiver,
          content: 'Call Aborted',
          isCall:true,
          createdAt : new Date().toISOString(),
          updatedAt : new Date().toISOString(),
        }
        addMessage(msg)
      }
      console.log('Cancelling outgoing call');
      socket.emit('cancelInitiateCall',outgoingCall);
      callingRingRingtone.pause();
      setLkToken(null);
      setOutgoingCall(null);
      return;
    }
    socket.emit('rejectOutgoingCall',outgoingCall);
    setOutgoingCall(null);
    setLkToken(null);
  }

  return (
    <div className="flex flex-col h-[calc(87vh-64px)] w-[calc(100vw-100px)] bg-[var(--bg-color)] m-10 text-[var(--text-color)]">
      <div className="flex flex-1 w-full overflow-hidden">
        <div className="hidden sm:flex h-full w-2/6 min-w-[250px] max-w-[350px] bg-[var(--bg-color)] border-r border-[var(--text-color)] flex-col">
          <ChatSideBar />
        </div>
        <div className="flex-1 h-full flex justify-center items-center overflow-hidden">
          {chatSelectedUser ? <ChatBox /> : <NoChatBox />}
        </div>
      </div>
      <audio className='hidden' ref={notifyRef} src={notifyAudio}></audio>
      {
        incomingCall && (
          <div className='fixed bottom-10 right-10 bg-white p-4 rounded-lg shadow-lg z-60'>
            <IncomingCallPopUp 
              name={incomingCall.username}
              accept={acceptIncomingCall}
              reject={rejectIncomingCall}
            />
          </div>
        )
      }
      {
        outgoingCall && (
          <div className='fixed bottom-10 right-10 bg-white p-4 rounded-lg shadow-lg z-60'>
            <OutgoingCallPopUp 
              name={outgoingCall.username}
              reject={rejectOutgoingCall}
            />
          </div>
        )
      }
      {
        lkToken && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-transparent z-50">
            <div className="w-full pr-28 bg-white/30 backdrop-blur-xl p-6 rounded-2xl shadow-lg text-black overflow-y-auto">
              <VideoCallPage />
            </div>
          </div>


        )
      }
      <audio className='hidden' src={incomingCallRingtone} ref={callRingtone}></audio>
    </div>
  );
};

export default ChatPage;
