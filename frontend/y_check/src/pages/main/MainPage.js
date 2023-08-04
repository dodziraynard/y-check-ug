import React from 'react'
import './main_page.scss'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
import Dashboard from '../dashboard/Dashboard'
function MainPage() {
  return (
    <div>
        <Nav/>
        <div className='main'>
          <Sidebar/>
          <Dashboard/>
        </div>
    </div>
    
  )
}

export default MainPage
