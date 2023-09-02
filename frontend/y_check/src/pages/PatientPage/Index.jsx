import React from 'react'
import PatientTable from '../../components/patient_table/PatientTable'
import Filter from '../../components/filter/Filter'
import './patient_page.scss'

const Index = () => {
  return (
    <div className='patient-main'>
        <Filter/>
        <PatientTable/>
    </div>
    
  )
}

export default Index
