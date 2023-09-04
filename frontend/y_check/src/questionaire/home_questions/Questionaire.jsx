import React, { useState,useEffect } from 'react';
import './questionaire.scss'
import family from '../../images/family.png'
import InputType from './InputType';
import CheckBoxType from './CheckBoxType';
import RadioType from './RadioType';
import { get_home_questions } from '../../actions/HomeQuestionsAction';
import {useDispatch, useSelector } from 'react-redux';
import { add_adolescent_responses } from '../../actions/AdolescentResponseAction';
// MAIN FUNCTION
const Questionaire = () => {
    const [userResponses, setUserResponses] = useState({});

    const dispatch = useDispatch()
    // GET ALL HOME QUESTION 
    const home_questions_list = useSelector(state => state.home_questions_list);
    const { home_questions } = home_questions_list;

    const get_adolescent = useSelector(state => state.get_adolescent)
    const {adolescent} = get_adolescent
    const adolescentID = adolescent.id
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

    const submitResponses = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
      
        // Create an array of response objects from userResponses
        const responses = [];
        for (const [question_title, response] of Object.entries(userResponses)) {
          responses.push({ adolescent:adolescentID,question_title, response });
        }
        for (const response of responses) {
          console.log(response);
        }
        dispatch(add_adolescent_responses(responses));

        // Optionally, you can add code to send the responses to your server here
    };
      
    return (
        <div className='home'>
            <div className="questionaire-first-circle">
                <form className='questionaire-form' onSubmit={submitResponses}>
                    {currentQuestions.map((question, index) => (
                    question.type === "multiple_choice" ? (
                        <RadioType key={index} currentQuestions={currentQuestions} setUserResponses={setUserResponses}/>
                    ) : (
                        question.type === "checkbox" ? (
                            <CheckBoxType key={index} currentQuestions={currentQuestions} setUserResponses={setUserResponses} />
                        ) : (
                            <InputType key={index} currentQuestions={currentQuestions}setUserResponses={setUserResponses} />
                            
                        )
                    )
                    ))}  
                    <div className='questionaire-buttons'>
                        <button className=''onClick={handlePreviousPage} style={{ cursor: 'pointer' }} type="button">Back</button>
                        <button className=''onClick={handleNextPage} style={{ cursor: 'pointer' }} type="submit">Next</button>
                    </div>
                </form>

            </div>
        </div>
    );
};


export default Questionaire
