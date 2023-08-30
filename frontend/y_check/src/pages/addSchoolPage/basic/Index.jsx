import React from 'react'
import BasicForm from './BasicForm'
import SchoolLabel from './SchoolLabel'
import './add_school.scss'

const Index = () => {
  return (
    <div className='add_school_main'>
      <SchoolLabel/>
      <BasicForm/>
    </div>
  )
}

export default Index
