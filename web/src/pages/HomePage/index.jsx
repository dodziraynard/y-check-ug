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
                <h1 className='text-center h1'>UG SPEECH DATA</h1>
                <div className='col-md-8 mx-auto'>
                    <h3 className="h3 text-center my-3">PROJECT AIM</h3>
                    <p className='my-3'>
                        <i className="bi bi-arrow-right me-3"></i>
                        To generate parallel datasets of transcribed audio
                        data and parallel text for Neural Machine Translation
                        in five Ghanaian languages (Akan,
                        Ewe,
                        Ikposo,
                        Dagaare and Dagbani)
                    </p>
                    <p className='my-3'>
                        <i className="bi bi-arrow-right me-3"></i>
                        To
                        analyze
                        and determine the most suitable
                        techniques to scale up data collection in 100
                        languages by the end of 2023 in an African low
                        resource context
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
