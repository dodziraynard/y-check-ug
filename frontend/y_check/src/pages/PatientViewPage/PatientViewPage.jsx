import React from 'react'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
import PatientDetail from '../../components/patientDatail/PatientDetail'
const PatientViewPage = () => {
    return (
        <div>
            <Nav/>
            <div className='main'>
              <Sidebar/>
              <PatientDetail/>
            </div>
        </div>
        
      )
}

export default PatientViewPage
