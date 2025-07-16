import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/user';
import profile from '../assets/profile.png';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isLogin, setUser, disconnect, setChatSelectedUser,uploadProfilePhoto, baseUrl, setLoading, setIsLogin,user,updateProfile } = useStore();
  const[userName,setUserName] = useState("username");
  const[email,setEmail] = useState("email");
  const[password,setPassword] = useState("password");
  const[profilePic,setProfilePic] = useState(profile);
  const navigate = useNavigate();
  const [noChanges,setNoChanges] = useState(false);
  const [empty,setEmpty] = useState(false);
  const fileInput = useRef(null)

  const handleLogout = async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (res.ok) {
      disconnect();
      setUser(null);
      setChatSelectedUser(null);
      setLoading(false);
      setIsLogin(false);
      navigate('/login');
    }
  };

  useEffect(()=>{
    setUserName(user?.username);
    setEmail(user?.email);
    setPassword(user?.password);
  },[user])

  useEffect(() => {
      setUser();
  }, [])

function handleUpdate(){
  setEmpty(false);
  setNoChanges(false);
  if(userName.trim() === "" || email.trim() === "" || password.trim() === ""){
    setEmpty(true);
    return;
  }
  if(userName=== user.username && email === user.email && password === user.password){
    setNoChanges(true);
    return;
  }
  const updatedUser = {
    ...user,
    username: userName,
    email: email,
    password: password,
  };
  updateProfile(updatedUser);
}

function handleUpdateProfilePicture() {
    const file = fileInput.current.files[0];
    if(!file)return;
    const formData = new FormData();
    formData.append('profile', file);
    formData.append('_id', user._id);
    uploadProfilePhoto(formData)
}



  return (
    <div className='w-full h-full flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] p-4'>
      <div className='w-4/6 flex justify-end items-center px-6 py-4 bg-[var(--bg-color)] text-[var(--text-color)] text-4xl ' >
        <p className='cursor-pointer' onClick={()=>navigate('/')}>X</p>
      </div>
      <div className='w-full h-full flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] p-4'>
        <img src={user?.profile || profile} className='w-32 h-32 rounded-full mb-6 border-4 border-[var(--primary-color)] shadow-lg cursor-pointer' alt="Profile"
        onClick={()=>{fileInput.current.click()}}
        />
        <input type="file" ref={fileInput} accept="image/*" className='hidden' onChange={handleUpdateProfilePicture} />
        

        <div className='w-full max-w-md mb-4'>
          <h1>Username</h1>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" className='w-full px-2 py-2 border-b-2 border-[var(--primary-color)] bg-transparent text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-[var(--primary-color)] transition duration-200'/>
        </div>

        <div className='w-full max-w-md mb-4'>
          <h1>Email</h1>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className='w-full px-2 py-2 border-b-2 border-[var(--primary-color)] bg-transparent text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-[var(--primary-color)] transition duration-200'/>
        </div>
        <div className='w-full max-w-md mb-4'>
          <h1>Password</h1>
          <input type="email" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className='w-full px-2 py-2 border-b-2 border-[var(--primary-color)] bg-transparent text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-[var(--primary-color)] transition duration-200'/>
        </div>

        {noChanges && <p className='text-red-500 mb-4'>No changes made</p>}
        {empty && <p className='text-red-500 mb-4'>Fields cannot be empty</p>}

        <button className='px-6 py-2 rounded-lg bg-[var(--primary-color)] text-white font-semibold hover:opacity-90 transition duration-200 shadow-md' 
        onClick={handleUpdate}>Update</button>
        <button className=' my-3 px-6 py-2 rounded-lg bg-[var(--primary-color)] text-white font-semibold hover:opacity-90 transition duration-200 shadow-md' 
        onClick={handleLogout}>Logout</button>
      </div>
    </div>

  )
}

export default Profile
