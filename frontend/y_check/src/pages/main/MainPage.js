import React from 'react'
import './main_page.scss'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
function MainPage() {
  return (
    <div>
        <Nav/>
        <div className='main'>
          <Sidebar/>
        </div>
    </div>
    
  )
}

export default MainPage
