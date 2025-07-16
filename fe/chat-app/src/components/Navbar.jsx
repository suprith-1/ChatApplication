import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/user';
import profile from '../assets/profile.png';

const themes = [
  { name: 'Light', className: '' },
  { name: 'Dark', className: 'theme-dark' },
  { name: 'Ocean', className: 'theme-ocean' },
  { name: 'Sunset', className: 'theme-sunset' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isLogin, setUser, disconnect, setChatSelectedUser, baseUrl, setLoading, setIsLogin,user } = useStore();
  const [selectedTheme, setSelectedTheme] = useState('theme-dark');

  const applyTheme = (themeClass) => {
    document.documentElement.className = themeClass;
  };

  useEffect(() => {
    applyTheme(selectedTheme);
  }, []);

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

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[var(--bg-color)] text-[var(--text-color)]">
      <p className="text-2xl font-bold cursor-pointer" onClick={()=>navigate('/')}>ChatApp</p>

      <div className="flex items-center space-x-6">

        {isLogin ? (
          <div className="cursor-pointer hover:text-[var(--hover-text-color)] text-xl transition" onClick={()=>navigate('/profile')}>
            <img src={user.profile || profile} alt="profile" className='w-10 h-10 mr-10 rounded-full' />
          </div>
        ) : (
          <>
            <div className="cursor-pointer hover:text-[var(--hover-text-color)] text-xl transition" onClick={() => navigate('/signup')}>
              Signup
            </div>
            <div className="cursor-pointer hover:text-[var(--hover-text-color)] text-xl transition" onClick={() => navigate('/login')}>
              Login
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
