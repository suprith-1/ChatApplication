import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/user'

const Login = () => {
    const username = useRef(null)
    const password = useRef(null)
    const navigate = useNavigate();
    const {connect,setUser,baseUrl} = useStore()
    const [wrongDetails,setWrongDetails] = useState(false);

    const handleLogin = async ()=>{
        setWrongDetails(false);
        const user = {
            username: username.current.value,
            password: password.current.value,
        }
        const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        if(res.ok){
            setUser();
            connect();
            navigate('/');
        } else {
            setWrongDetails(true);
        }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] p-6">
        <div className="bg-[var(--bg-color)] shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-[var(--text-color)]">

            <input
                type="text"
                placeholder="Username"
                name='username'
                ref={username}
                className="w-full px-4 py-2 border border-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-transparent text-[var(--text-color)]"
            />

            <input
                type="password"
                placeholder="Password"
                ref={password}
                className="w-full px-4 py-2 border border-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-transparent text-[var(--text-color)]"
            />
            {wrongDetails && <span className='text-red-500 my-2'>Wrong username or password</span>}

            {wrongDetails && <span className='text-red-500 my-2'>Wrong username or password</span>}

            <button
                onClick={handleLogin}
                className="w-full bg-[var(--primary-color)] text-white my-2 py-2 rounded-lg hover:bg-[var(--hover-color)] transition duration-300"
            >Login</button>
        </div>
    </div>
  )
}

export default Login
