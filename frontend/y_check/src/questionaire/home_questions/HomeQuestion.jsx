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

    const propertiesPerPage = 1; 

    const totalPages = Math.ceil(home_questions.length / propertiesPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentQuestions = home_questions.slice(startIndex, endIndex);
        
        // HANDLE THE PAGE LIMIT 
    const handlePageChange = pageNumber => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    // PAGINATION NEXT PAGE
    const handleNextPage = () => {
        handlePageChange(currentPage + 1);
    };
    // PAGINATION PREVIUOS PAGE
    const handlePreviousPage = () => {
        handlePageChange(currentPage - 1);
    };
    
    

 
  return (
    <div className='page-progress'>
            <div className='login'>
            
                <div className='login-container'>
                    <div className='login-image'>
                        <img src={ug_logo} alt="Logo" />
                    </div>
                    <div className="login-title">
                        {currentQuestions.map((question,index) => (
                            <h2 key={index}>{question.title}</h2>
                        ))}
                    </div>
                    <form className="login-form"> 
                    {currentQuestions.map((question, index) => (
                        question.type === "multiple_choice" ? (
                            <RadioType key={index} currentQuestions={currentQuestions} />
                        ) : (
                            question.type === "checkbox" ? (
                                <CheckBoxType key={index} currentQuestions={currentQuestions} />
                            ) : (
                                <InputType key={index} currentQuestions={currentQuestions} />
                                
                            )
                        )
                        ))}
                       <div className='adolescent-button'>
                            <button className='adolescent-pre'onClick={handlePreviousPage} style={{ cursor: 'pointer' }} type="button">Back</button>
                            <button className='adolescent-pre'onClick={handleNextPage}  style={{ cursor: 'pointer' }} type="button">Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    
    )
}

export default HomeQuestion
