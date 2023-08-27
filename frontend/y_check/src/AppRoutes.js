import React from 'react'
import PatientPage from './pages/PatientPage/PatientPage';
import PatientDetailPage from './pages/PatientDetailPage/PatientDetailPage';
import {Routes,Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import AddShS from './pages/addSchoolPage/shs/AddShS';
import AddSchool from './pages/addSchoolPage/basic/AddSchool';
import AddCommunity from './pages/addSchoolPage/community/AddCommunity';
import BasicSchools from './pages/addSchoolPage/basic/BasicSchools';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/dashboard'element={<Dashboard/>}/>
            <Route path='/add_shs'element={<AddShS/>}/>
            <Route path='/add_community'element={<AddCommunity/>}/>
            <Route path='/patients' element={<PatientPage/>}/>
            <Route path='/add_school' element={<AddSchool/>}/>
            <Route path='/get_all_basic_all' element={<BasicSchools/>}/>
            <Route path='/patient_detail' element={<PatientDetailPage/>}/>
        </Routes>
    );
}

export default AppRoutes
