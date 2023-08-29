import React, { useState,useEffect } from 'react';
import './App.css';
import Nav from './components/nav/Nav';
import Sidebar from './components/sidebar/Sidebar';
import MainPage from './pages/main/MainPage';
import AuthRoute from './AuthRoute';
import {useDispatch,useSelector } from 'react-redux'
import { get_single_adolescent } from './actions/AddAdolescentAction';
function App() {
  const dispatch = useDispatch()

  const get_adolescent = useSelector(state => state.get_adolescent)
  const {adolescent} = get_adolescent


  const isAppRoute = 
    window.location.pathname.startsWith('/dashboard') ||
    window.location.pathname.startsWith('/patients') ||
    window.location.pathname.startsWith(`/patient_detail/${12}/`)||
    window.location.pathname.startsWith('/add_community')||
    window.location.pathname.startsWith('/add_school')||
    window.location.pathname.startsWith('/add_shs')
  return (
    <>
      {isAppRoute ? (
      <div>
      <Nav />
        <div className='main'>
          <Sidebar />
          <MainPage />
        </div>
      </div>
      ) : (
        <>
        <AuthRoute/>
        </>
      )}
    </>
  ) ;
}

export default App;
