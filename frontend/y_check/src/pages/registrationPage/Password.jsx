import React from 'react'
import Icon from '@mdi/react';
import {mdiEyeOutline,mdiEyeOffOutline } from '@mdi/js'
const Password = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

// HANDLE PASSWORD VISIBILITY
    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };
  return (
    <>
      <div className="input-with-icon">
            <input type={passwordVisible ? 'text' : 'password'}
            placeholder='Password:'
            name='password'
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
            name='confirm_password'
            required/>
            <Icon className='login-icon' 
            path={passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
            size={1} 
            onClick={handleTogglePasswordVisibility}
            style={{cursor:'pointer'}}
            />
        </div>
        <button style={{cursor:'pointer'}}>LOGIN</button>
    </>
  )
}

export default Password
