import React from 'react'
import Navbar from './Navbar'
import ChatsList from './ChatsList'
import ChatArea from './ChatArea'

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <div className='flex'>
        <ChatsList />
        <ChatArea />
      </div>

    </div>
  )
}

export default Homepage
