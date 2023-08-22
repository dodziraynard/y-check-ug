import React from 'react'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import './landing.scss'
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';
import { Link } from 'react-router-dom';

// MAIN FUNCTION
const LandingPage = () => {
    return (
        <div className='home'>
            <div className="first-circle">
                <div className="second-circle">
                    <div className="circle-image">
                        <img src={ug_logo} alt="" />
                    </div>
                    <div className="circle-text">
                        <h5>Proceed to add new adolescent </h5>
                    </div>
                    <div className="circle-text-mobile">
                        <h5>Proceed to add new  <br />adolescent <span><Icon path={mdiArrowRight} size={1} /></span> </h5>
                    </div>
                </div>
                <Link className='link' to='/add_adolescent'> <button className=''>Proceed</button></Link> 
            </div>
        </div>
    );
};


export default LandingPage
