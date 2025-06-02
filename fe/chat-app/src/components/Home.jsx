import React, { useEffect, useRef } from 'react'
import Signup from './Signup'
import Navbar from './Navbar'
import { useStore } from '../store/user'
import ChatPage from './ChatPage'
import { useLocation } from 'react-router-dom';

const Home = () => {
const {isLogin,setUser} = useStore();
useEffect(() => {
    setUser();
}, [])
  return (
    <>
        <div className='h-full w-full flex flex-col justify-between'>
            <Navbar/>
            {isLogin?
                (
                    <ChatPage/>
                ):
                (
                    <Signup/>
                )
            }
        </div>
    </>
  )
}

export default Home
