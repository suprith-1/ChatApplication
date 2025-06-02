import React from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/user'

const Login = () => {
    const username = useRef(null)
    const password = useRef(null)
    const navigate = useNavigate();
    const {connect,setUser} = useStore()

    const handleLogin = async ()=>{
        const user = {
            username: username.current.value,
            password: password.current.value,
        }
        const res = await fetch('http://localhost:5555/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        if(res.ok){
            alert('User login in successfully');
            connect()
            navigate('/');
        } else {
            alert('Failed to log in')
        }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">

                <input
                    type="text"
                    placeholder="Username"
                    ref={username}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    ref={password}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >Login</button>
            </div>
        </div>
  )
}

export default Login
