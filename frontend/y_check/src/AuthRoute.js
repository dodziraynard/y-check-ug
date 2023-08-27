import React from 'react'
import Home from './components/home/Home';
import LoginPage from './pages/loginPage/LoginPage';
import Register from './pages/registrationPage/Register'
import LandingPage from './questionaire/landingPage/LandingPage';
import {Routes,Route } from 'react-router-dom';
import AddAdolescent from './questionaire/add_adolescent/AddAdolescent';

const AuthRoute = () => {
    return (
        <Routes>
            <Route path='/'element={<Home/>}/>
            <Route path='/add_adolescent'element={<AddAdolescent/>}/>
            <Route path='/landing'element={<LandingPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<Register/>}/>
        </Routes>
    );
}

export default AuthRoute
