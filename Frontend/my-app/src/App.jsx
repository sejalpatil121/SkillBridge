import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavBar from "./components/Navbar";
import { Route, Routes } from 'react-router-dom'
// import Home from './components/Home'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Footer from './components/Footer';
import Seach from './components/Seach'
import Recommend from "./pages/Recommend";

import './App.css';
import './index.css';


function App() {
  

  return (
    <>
     <div>
      <NavBar/>
     <main className='main-content'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/search' element={<Seach />} /> 
        <Route path="/recommend" element={<Recommend />} />
       

        

      </Routes>
     </main>
     <Footer/>
     </div> 
    </>
  )
}

export default App
