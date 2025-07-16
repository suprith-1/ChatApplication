import React, { useEffect, useRef } from 'react'
import Login from './Login'
import Navbar from './Navbar'
import { useStore } from '../store/user'
import ChatPage from './ChatPage'
import { useLocation } from 'react-router-dom';

const Home = () => {
const {isLogin,setUser} = useStore()

useEffect(() => {
    setUser();
}, [])
  return (
    <>
        <div className='h-full w-full flex flex-col justify-between bg-[var(--bg-color)] text-[var(--text-color)]'>
            <Navbar/>
            {isLogin?
                (
                    <ChatPage/>
                ):
                (
                    <Login/>
                )
            }
        </div>
    </>
  )
}

export default Home
