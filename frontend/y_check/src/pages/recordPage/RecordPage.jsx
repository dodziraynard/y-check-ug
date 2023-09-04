import React from 'react'
import Index from './Index'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
const RecordPage = () => {
   
  return (
    <div>
        <Nav />
        <div className='main'>
            <Sidebar />
            <Index />
        </div>
    </div>
  )
}

export default RecordPage