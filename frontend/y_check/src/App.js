import React, { useState,useEffect } from 'react';

import './App.css';
import Home from './components/home/Home';
import LoginPage from './pages/loginPage/LoginPage';
import Register from './pages/registrationPage/Register'
import LandingPage from './questionaire/landingPage/LandingPage';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import AddAdolescent from './questionaire/add_adolescent/AddAdolescent';
import Questionaire from './questionaire/home_questions/Questionaire';
import PatientDetailPage from './pages/PatientDetailPage/PatientDetailPage';
import Dashboard from './pages/dashboard/Dashboard';
import PatientPage from './pages/PatientPage/PatientPage';
import AddSchool from './pages/addSchoolPage/basic/AddSchool';
import AddShS from './pages/addSchoolPage/shs/AddShS';
import AddCommunity from './pages/addSchoolPage/community/AddCommunity';

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/add_adolescent'element={<AddAdolescent/>}/>
        <Route path='/landing'element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/questionaire' element={<Questionaire/>}/>
        <Route path='/patient_detail/:id/' element={<PatientDetailPage/>}/>
        <Route path='/dashboard'element={<Dashboard/>}/>
        <Route path='/patients' element={<PatientPage/>}/>
        <Route path='/add_school' element={<AddSchool/>}/>
        <Route path='/add_shs'element={<AddShS/>}/>
        <Route path='/add_community'element={<AddCommunity/>}/>
      </Routes>
  </Router>
  )
}

export default App;
