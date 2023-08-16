import React, { useState } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { Link } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';


const Register = () => {
    
    return (
        <div className='login'>
            <div className='login-container'>
                <div className='login-image'>
                    <img src={ug_logo} alt="Logo" />
                </div>
                <div className="login-title">
                    <h2>Sign Up</h2>
                </div>
                <form className="login-form">
                    <PersonalInfo/>
                </form>
            </div>
        </div>
    
      )
}

export default Register
