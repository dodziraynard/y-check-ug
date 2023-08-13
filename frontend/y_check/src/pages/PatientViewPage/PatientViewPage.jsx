import React from 'react'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
const PatientViewPage = () => {
    return (
        <div>
            <Nav/>
            <div className='main'>
              <Sidebar/>
            </div>
        </div>
        
      )
}

export default PatientViewPage
