import React from 'react'
import Navbar from './Navbar'
import ChatsList from './ChatsList'
import ChartArea from './ChatArea'

const Homepage = () => {
  return (
    <div>
      <Navbar/>
      <div className='flex'>
        <ChatsList/>
        <ChartArea/>
      </div>
      
    </div>
  )
}

export default Homepage
