import React from 'react'
import BasicSchoolTableList from '../../../components/schoolList/BasicSchoolTableList'
import SchoolLabel from './SchoolLabel'
const BasicSchools = () => {
  return (
    <div className='add_school_main'>
      <SchoolLabel/>
      <BasicSchoolTableList/>
    </div>
  )
}

export default BasicSchools
