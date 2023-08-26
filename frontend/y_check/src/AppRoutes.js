import React from 'react'
import PatientPage from './pages/PatientPage/PatientPage';
import PatientDetailPage from './pages/PatientDetailPage/PatientDetailPage';
import {Routes,Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import AddSchool from './pages/addSchoolPage/AddSchool';
const AppRoutes = () => {
    return (
        <Routes>
        <Route path='/dashboard'element={<Dashboard/>}/>
        <Route path='/patients' element={<PatientPage/>}/>
        <Route path='/add_school' element={<AddSchool/>}/>
        <Route path='/patient_detail' element={<PatientDetailPage/>}/>
        </Routes>
    );
}

export default AppRoutes
