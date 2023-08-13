import React from 'react'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
import Patient from '../../components/patient/Patient'
const PatientPage = () => {
  return (
    <div>
        <Nav/>
        <div className='main'>
          <Sidebar/>
          <Patient/>
        </div>
    </div>
    
  )
}

export default PatientPage
