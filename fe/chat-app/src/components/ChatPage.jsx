import React from 'react';
import ChatSideBar from './ChatSideBar';
import NoChatBox from './NoChatBox';
import ChatBox from './chatBox';
import { useEffect } from 'react';
import { useStore } from '../store/user';

const ChatPage = () => {
  const { chatSelectedUser } = useStore();
  const {connect} = useStore();

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="flex flex-col h-[calc(87vh-64px)] w-[calc(100vw-100px)] bg-gray-50 m-10">
      <div className="flex flex-1 w-full overflow-hidden">
        <div className="hidden sm:flex h-full w-2/6 min-w-[250px] max-w-[350px] bg-gray-100 border-r border-gray-300 flex-col">
          <ChatSideBar />
        </div>
        <div className="flex-1 h-full flex justify-center items-center overflow-hidden">
          {chatSelectedUser ? <ChatBox /> : <NoChatBox />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
