import React, { useState } from 'react'
import { useRef } from 'react'
import { ScaleLoader  } from 'react-spinners';
import { useStore } from '../store/user';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const username = useRef(null)
    const password = useRef(null)
    const email = useRef(null)
    const {setUser,baseUrl,setLoading,connect} = useStore();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async ()=>{
        setLoading(true);
        const user = {
            username: username.current.value,
            password: password.current.value,
            email: email.current.value
        }
        const res = await fetch(`${baseUrl}/auth/signin`, {
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
            alert('Failed to sign in')
        }
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }
  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] p-6">
            <div className="bg-[var(--bg-color)] shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-[var(--text-color)]">

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    ref={username}
                    className="w-full px-4 py-2 border border-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-transparent text-[var(--text-color)]"
                />

                <input
                    type="password"
                    placeholder="Password"
                    ref={password}
                    className="w-full px-4 py-2 border border-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-transparent text-[var(--text-color)]"
                />

                <input
                    type="text"
                    placeholder="Email"
                    name='email'
                    ref={email}
                    className="w-full px-4 py-2 border border-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-transparent text-[var(--text-color)]"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full overflow-hidden bg-[var(--primary-color)] text-white py-2 rounded-lg hover:bg-[var(--hover-color)] transition duration-300"
                >{isButtonLoading?<ScaleLoader className='justify-center items-center h-full pt-2'  color="#ffffff" height={20} barCount={7} speedMultiplier={1.2} />:"Signup"}</button>
            </div>
        </div>
);

}

export default Signin
