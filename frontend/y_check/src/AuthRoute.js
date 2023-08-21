import React from 'react'
import Home from './components/home/Home';
import LoginPage from './pages/loginPage/LoginPage';
import Register from './pages/registrationPage/Register'
import {Routes,Route } from 'react-router-dom';

const AuthRoute = () => {
    return (
        <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<Register/>}/>
        </Routes>
    );
}

export default AuthRoute
