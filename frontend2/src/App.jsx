import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/chats" element={<Homepage/>}/>
      </Routes>
    </div>
  )
}

export default App
