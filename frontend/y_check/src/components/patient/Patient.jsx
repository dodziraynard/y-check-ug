import React from 'react'
import './patient.scss'
import Filter from './Filter'
import PatientTable from './PatientTable'
const Patient = () => {
  return (
    <div className='patient-main'>
        <Filter/>
        <PatientTable/>
    </div>
    
  )
}

export default Patient
