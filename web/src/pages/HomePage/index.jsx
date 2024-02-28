import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import './style.scss'


function HomePage() {
    const [webConfigurations, setWebConfigurations] = useState(null);
    const toast = useToast();

    
    return (
        <div className="home-page">
            <div className="content col-11 col-md-8 mx-auto">
                <h1 className='text-center h1'>Y-CHECK-GHANA</h1>
                <div className='col-md-8 mx-auto'>
                    <h3 className="h3 text-center my-3">PROJECT AIM</h3>
                    <p className='my-3'>
                        <i className="bi bi-arrow-right me-3"></i>
                        The goal is to identify key contextual information on adolescent health,
                        determine specific components of the health check-up intervention 
                        that are feasible and acceptable to adolescents, parents, 
                        and other stakeholders, and develop a theoretical framework 
                        for the health check-up intervention 
                    </p>
                    <p className='my-3'>
                        <i className="bi bi-arrow-right me-3"></i>
                        The ultimate objective is 
                        to improve adolescent health outcomes by providing
                        accessible and effective health check-ups tailored 
                        to the needs of adolescents in Ghana
                    </p>

                </div>
                <p className='text-center mt-4'>Below are some helpful resources for the meantime.</p>

                <div className='text-center my-3 d-flex mx-auto justify-content-center align-items-center flex-wrap'>
                        <a  className="mx-4">
                            <button className="btn btn-primary"><i className="bi bi-android2"></i> GET APK</button>
                        </a>
                    <Link to={'/dashboard'} className="mx-4 my-2">
                        <button className="btn btn-outline-primary text-white"><i className="bi bi-grid-fill"></i> Dashboard</button>
                    </Link>
    
                </div>
            </div>
        </div>
    );
}

export default HomePage;
