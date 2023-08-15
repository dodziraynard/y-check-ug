import React, { useState } from 'react';
import './login.scss'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import Icon from '@mdi/react';
import { mdiAccount,mdiEyeOutline,mdiEyeOffOutline } from '@mdi/js';

const LoginPage = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');

    const handleTogglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  return (
    <div className='login'>
        <div className='login-container'>
            <div className='login-image'>
                <img src={ug_logo} alt="Logo" />
            </div>
            <div className="login-title">
                <h2>Login</h2>
            </div>
            <div className="login-form">
                <span>Please input the correct credential</span>
                <div className="input-with-icon">
                    <input type="text" placeholder='Staff ID:'/>
                    <Icon className='login-icon' path={mdiAccount} size={1} />
                </div>
                <div className="input-with-icon">
                    <input type={passwordVisible ? 'text' : 'password'}
                    placeholder='Password:'
                    value={password}
                    onChange={e => setPassword(e.target.value)}/>
                    <Icon className='login-icon' 
                    path={passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
                    size={1} 
                    onClick={handleTogglePasswordVisibility}
                    style={{cursor:'pointer'}}
                    />
                </div>
                <span>Forget password? <span style={{color:'#B5965C',cursor:'pointer'}}>reset</span></span>
                <button>LOGIN</button>
                <span>Don't have an account?<span style={{color:'#B5965C',cursor:'pointer'}}> sign up</span></span>
            </div>
        </div>
    </div>

  )
}

export default LoginPage
