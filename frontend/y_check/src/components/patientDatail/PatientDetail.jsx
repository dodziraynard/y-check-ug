import React from 'react'
import { useState } from 'react';
import './patient_detail.scss'
const PatientDetail = () => {
    const [activeRecord, setActiveRecord] = useState(null);
    const handleRecordClick = (recordIndex) => {
    setActiveRecord(recordIndex);
  };
  return (
    <div className='detail'>
        <div className="top-nav">
            <div  className={`record first ${activeRecord === 0 ? 'active-nav' : ''}`}
            onClick={() => handleRecordClick(0)}>
                <span>Patient Record</span>
            </div>
            <div  className={`record ${activeRecord === 1 ? 'active-nav' : ''}`}
            onClick={() => handleRecordClick(1)}>
                <span>Appointment</span>
            </div>
            <div className={`record ${activeRecord === 2 ? 'active-nav' : ''}`}
            onClick={() => handleRecordClick(2)}>
                <span>Referrals</span>
            </div>
            <div className={`record last ${activeRecord === 3 ? 'active-nav' : ''}`}
            onClick={() => handleRecordClick(3)}>
                <span>Status</span>
            </div>
        </div>
    </div>
  )
}

export default PatientDetail
