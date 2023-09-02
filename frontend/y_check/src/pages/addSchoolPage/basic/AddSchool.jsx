import React from 'react'
import './add_school.scss'
import Index from './Index'
import Nav from '../../../components/nav/Nav'
import Sidebar from '../../../components/sidebar/Sidebar'
const AddSchool = () => {
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

export default AddSchool
