import React, { useState,useEffect } from 'react';
import './login.scss'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import Icon from '@mdi/react';
import { Link } from 'react-router-dom';
import { mdiAccount,mdiEyeOutline,mdiEyeOffOutline } from '@mdi/js';
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { login } from '../../actions/userActions';

// MAIN FUNCTION 
const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);

// useState Field FOR USER LOGIN
    const [user, setUser] = useState({
        staff_id: "",
        password: "",
        
    })

// GETTING THE STATE FROM THE STORE 
    const user_login = useSelector(state => state.user_login)
    const { error, loading, userInfo } = user_login

// HANDLE GET THE USER INPUT (staff_id and password)
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
    
        setUser({ ...user, [name]: value });
    };
// HANDLE PASSWORD VISIBILITY
    const handleTogglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
    };
// HANDLE FORM SUBMIT 
    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(login(user.staff_id,user.password))

// Clear input fields after form submission
        setUser({
            staff_id: "",
            password: "",
        });
    }
// FUNCTION REDIRECT THE USER
    useEffect(() => {
        if (userInfo) {
// Redirect to /landing after successful login
            navigate('/landing');
        } 
    }, [userInfo, navigate]);

  return (
    <div className='login'>
        <div className='login-container'>
            <div className='login-image'>
                <img src={ug_logo} alt="Logo" />
            </div>
            <div className="login-title">
                <h2>Login</h2>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
            {error? <span style={{color:'red'}}> Invalid Credentials</span>:''}
                <span>Please input the correct credential</span>
                <div className="input-with-icon">
                    <input type="text" 
                    placeholder='Staff ID:'
                    name='staff_id'
                    onChange={handleChange}
                    value={user.staff_id}
                    required/>
                    <Icon className='login-icon' path={mdiAccount} size={1} />
                </div>
                <div className="input-with-icon">
                    <input type={passwordVisible ? 'text' : 'password'}
                    placeholder='Password:'
                    name='password'
                    value={user.password}
                    onChange={handleChange}
                    required/>
                    <Icon className='login-icon' 
                    path={passwordVisible ? mdiEyeOffOutline : mdiEyeOutline}
                    size={1} 
                    onClick={handleTogglePasswordVisibility}
                    style={{cursor:'pointer'}}
                    />
                </div>
                <span>Forget password? <span style={{color:'#B5965C',cursor:'pointer',textDecoration: 'underline'}}>reset</span></span>
                <button className='login-button' style={{cursor:'pointer'}}>LOGIN</button>
                <span>Don't have an account? <Link style={{ textDecoration: '#B5965C' }} to='/register'><span style={{color:'#B5965C',cursor:'pointer',textDecoration: 'underline'}}> sign up</span></Link></span>
            </form>
        </div>
    </div>

  )
}

export default LoginPage
