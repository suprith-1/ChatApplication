import React, { useState } from 'react'
import { useRef } from 'react'
import { ScaleLoader  } from 'react-spinners';
import { useStore } from '../store/user';

const Signin = () => {
  const username = useRef(null)
    const password = useRef(null)
    const email = useRef(null)
    const {setUser} = useStore();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const handleSubmit = async ()=>{
        setIsButtonLoading(true);
        const user = {
            username: username.current.value,
            password: password.current.value,
            email: email.current.value
        }
        const res = await fetch('https://chat-app-backend-phi-three.vercel.app/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        if(res.ok){
            alert('User signed in successfully')
            setUser();
        } else {
            alert('Failed to sign in')
        }
        setTimeout(() => {
            setIsButtonLoading(false);
        }, 600);
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

                <input
                    type="text"
                    placeholder="Email"
                    ref={email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full overflow-hidden bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >{isButtonLoading?<ScaleLoader className='justify-center items-center h-full pt-2'  color="#ffffff" height={20} barCount={7} speedMultiplier={1.2} />:"Signup"}</button>
            </div>
        </div>
);

}

export default Signin
