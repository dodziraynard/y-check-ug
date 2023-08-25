import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';

const PersonalInfo = ({ formData, handleInputChange }) => {
    
  return (
    <>
      <span>Please input the correct credential</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Staff ID:'
            name='staff_id'
            value={formData.staff_id}
            onChange={handleInputChange}
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='First Name:'
            name='first_name'
            value={formData.first_name}
            onChange={handleInputChange}
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Last Name:'
            name='last_name'
            value={formData.last_name}
            onChange={handleInputChange}
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Phone Number:'
            name='phone'
            value={formData.phone}
            onChange={handleInputChange}
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
    </>
  )
}

export default PersonalInfo
