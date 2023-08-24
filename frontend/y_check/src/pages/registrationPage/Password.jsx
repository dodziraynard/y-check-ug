import React, { useState,useEffect } from 'react';
import Icon from '@mdi/react';
import {mdiEyeOutline,mdiEyeOffOutline } from '@mdi/js'

const Password = ({ formData, handleInputChange }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordMessage,setPasswordMessage] = useState(false)

// HANDLE PASSWORD CHECK
    useEffect(() => {
      if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
        setPasswordMessage(true);
      } else {
          setPasswordMessage(false);
      }
  }, [formData.password, formData.confirm_password]);

// HANDLE PASSWORD VISIBILITY
    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };
  return (
    <>
        <span>Please input the correct credential</span>
      <div className="input-with-icon">
            <input type={passwordVisible ? 'text' : 'password'}
            placeholder='Password:'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            required/>
            <Icon className='login-icon' 
            path={passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
            size={1} 
            onClick={handleTogglePasswordVisibility}
            style={{cursor:'pointer'}}
            />
        </div>
        <div className="input-with-icon">
            <input type={passwordVisible ? 'text' : 'password'}
            placeholder='Confirm Password:'
            value={formData.confirm_password}
            onChange={handleInputChange}
            name='confirm_password'
            required/>
            <Icon className='login-icon' 
            path={passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
            size={1} 
            onClick={handleTogglePasswordVisibility}
            style={{cursor:'pointer'}}
            />
        </div>
        {passwordMessage ? <span style={{color:'red'}}>wrong password</span> : ('')}
    </>
  )
}

export default Password
