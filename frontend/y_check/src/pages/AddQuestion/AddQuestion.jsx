import React from 'react'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
import Index from './Index'

const AddQuestion = () => {
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

export default AddQuestion