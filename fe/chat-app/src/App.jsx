import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Loader from './components/Loader';
import { useStore } from './store/user';
import Profile from './components/Profile';

function App() {
  const {isLoading} = useStore();

  return (
    <BrowserRouter>
      <div className="bg-[var(--bg-color)] text-[var(--text-color)] min-h-screen">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/login' element={<div><Navbar/><Login/></div>} />
          <Route path="/signup" element={<div><Navbar/><Signup/></div>} />
          <Route path="/profile" element={<div><Navbar/><Profile/></div>} />
          <Route path="*" element={<div className='flex justify-center items-center h-screen text-2xl'>Page Not Found</div>} />
        </Routes>
        {isLoading && <Loader/>}
      </div>
    </BrowserRouter>
  )
}

export default App
