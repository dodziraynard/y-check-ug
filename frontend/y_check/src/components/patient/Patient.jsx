import React from 'react'
import './patient.scss'
import Filter from './Filter'
import BasicTable from '../table/Table'
const Patient = () => {
  return (
    <div className='patient-main'>
        <Filter/>
        <BasicTable/>
    </div>
    
  )
}

export default Patient
