import React, { useState,useEffect } from 'react';
import './questionaire.scss'
import family from '../../images/family.png'
import InputType from './InputType';
import CheckBoxType from './CheckBoxType';
import RadioType from './RadioType';
import { get_home_questions } from '../../actions/HomeQuestionsAction';
import {useDispatch, useSelector } from 'react-redux';

// MAIN FUNCTION
const Questionaire = () => {
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
        <div className='home'>
            <div className="questionaire-first-circle">
                <form className='questionaire-form'>
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
                </form>
                <div className='questionaire-buttons'>
                    <button className=''onClick={handlePreviousPage} style={{ cursor: 'pointer' }} type="button">Back</button>
                    <button className=''onClick={handleNextPage} style={{ cursor: 'pointer' }} type="button">Next</button>
                </div>

            </div>
        </div>
    );
};


export default Questionaire
