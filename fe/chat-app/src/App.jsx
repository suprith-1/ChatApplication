import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/login' element={<div><Navbar/><Login/></div>} />
        <Route path="/signup" element= {<div><Navbar/><Signup/></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
