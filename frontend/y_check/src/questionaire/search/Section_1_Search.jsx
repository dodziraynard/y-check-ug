import React from 'react'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;

const Section_1_Search = () => {
    return (
        <div className='home'>
            <div className="questionaire-first-circle">
                <form className='questionaire-form'>
                <div className="questionaire-input">
                <div className='login-image' style={{marginTop:"500px",marginBottom:"50px", marginLeft:"30px"}}>
                    <img src={ug_logo} alt="Logo" />
                </div>
                    <input type="text" 
                    placeholder='Enter Adolescent PIP Number or Name'
                    name='surname'
                    required style={{width:"130%", marginLeft:"-30px",fontSize:"8px"}}/>
                </div>
                </form>
                <div className='questionaire-buttons'>
                    <button  style={{ cursor: 'pointer' }} type="button">Search</button>
                </div>

            </div>
        </div>
    );
}

export default Section_1_Search
