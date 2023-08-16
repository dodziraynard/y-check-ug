import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiAccount,mdiEyeOutline,mdiEyeOffOutline } from '@mdi/js';

const PersonalInfo = () => {
    
  return (
    <>
      <span>Please input the correct credential</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Staff ID:'
            name='staff_id'
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='First Name:'
            name='firstname'
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Last Name:'
            name='lastname'
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>
        <div className="input-with-icon">
            <input type="number" 
            placeholder='Phone Number:'
            name='phone_number'
            required/>
            <Icon className='login-icon' path={mdiAccount} size={1} />
        </div>

        <button style={{cursor:'pointer'}}>Proceed</button>

    </>
  )
}

export default PersonalInfo
