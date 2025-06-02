import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/user';

const Navbar = () => {

    const navigate = useNavigate();
    const {isLogin,setUser,disconnect} = useStore();
    const handleLogout = async () =>{
        const res = await fetch('http://localhost:5555/auth/logout',{
            method: 'POST',
            credentials: 'include'
        })
        if(res.ok){
            disconnect();
            setUser(null);
        }
    }
  return (
    <div className='flex justify-center bg-blue-500 items-center'>
        <p className="text-2xl w-40 font-bold py-4 px-4">ChatApp</p>
        <div className="flex w-full justify-end space-x-6 pr-6">
            {isLogin? (
                <div className="cursor-pointer hover:text-yellow-400 text-2xl transition" onClick={handleLogout}>Logout</div>
            ) : (
                <>
                    <div className="cursor-pointer hover:text-yellow-400 text-2xl transition" onClick={() => navigate('/signup')}>Signup</div>
                    <div className="cursor-pointer hover:text-yellow-400 text-2xl transition" onClick={() => navigate('/login')}>Login</div>
                </>
            )}
        </div>
    </div>

  )
}

export default Navbar
