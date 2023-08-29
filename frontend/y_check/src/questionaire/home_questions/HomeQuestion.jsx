import React, { useState,useEffect } from 'react';
import axios from 'axios'
import InputType from './InputType'
import RadioType from './RadioType'
import CheckBoxType from './CheckBoxType'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { get_home_questions } from '../../actions/HomeQuestionsAction';
import {useDispatch, useSelector } from 'react-redux';

// MAIN COMPONENT
const HomeQuestion = () => {
    const dispatch = useDispatch()
    // GET ALL HOME QUESTION 
    const home_questions_list = useSelector(state => state.home_questions_list);
    const { home_questions } = home_questions_list;

    useEffect(() => {
        dispatch(get_home_questions());
    }, [dispatch]);

    console.log(home_questions)


 
  return (
    <div className='page-progress'>
            <div className='login'>
            
                <div className='login-container'>
                    <div className='login-image'>
                        <img src={ug_logo} alt="Logo" />
                    </div>
                    <div className="login-title">
                        <h2>Questionaire</h2>
                    </div>
                    <form className="login-form"> 
                       <RadioType home_questions={home_questions}/>
                       <CheckBoxType/>

                       <div className='adolescent-button'>
                            <button className='adolescent-pre' style={{ cursor: 'pointer' }} type="button">Back</button>
                            <button className='adolescent-pre'  style={{ cursor: 'pointer' }} type="button">Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    
    )
}

export default HomeQuestion
