import { useRef, useEffect, useState } from 'react';
import './questionaire.scss'
import InputType from './InputType';
import CheckBoxType from './CheckBoxType';
import RadioType from './RadioType';
import { get_home_questions } from '../../actions/HomeQuestionsAction';
import {useDispatch, useSelector } from 'react-redux';
import { get_question_options } from '../../actions/AddOptionAction';
//import { add_adolescent_responses } from '../../actions/AdolescentResponseAction';
// MAIN FUNCTION
const Questionaire = () => {

    const dispatch = useDispatch()
    // GET ALL HOME QUESTION 
    const home_questions_list = useSelector(state => state.home_questions_list);
    const { home_questions } = home_questions_list;
    // GET THE ADOLESCENT IN QUESTION
    const get_adolescent = useSelector(state => state.get_adolescent)
    const {adolescent} = get_adolescent
    //const adolescentID = adolescent.id
    // GET THE CURRENT QUESTION OPTIONS
    const question_options_list = useSelector(state => state.question_options_list)
    const {question_options} = question_options_list

    console.log(question_options)

    const propertiesPerPage = 1; 

    const totalPages = Math.ceil(home_questions.length / propertiesPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentQuestions = home_questions.slice(startIndex, endIndex);
    
    useEffect(() => {
        dispatch(get_home_questions());
    }, [dispatch]);
      
    const previousQuestionsRef = useRef([]);

    useEffect(() => {
    // Only fetch question options when the currentQuestions array changes
    const previousQuestions = previousQuestionsRef.current;
    
    if (!arraysAreEqual(previousQuestions, currentQuestions)) {
        currentQuestions.forEach((question) => {
        dispatch(get_question_options(question.id));
        });
    }

    // Update the previousQuestionsRef with the current value of currentQuestions
    previousQuestionsRef.current = currentQuestions;
    }, [dispatch, currentQuestions]);

    // A utility function to compare two arrays
    function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
        return false;
        }
    }
    return true;
    }
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
      
    };
      
    return (
        <div className='home'>
            <div className="questionaire-first-circle">
                <form className='questionaire-form' onSubmit={submitResponses}>
                    {currentQuestions.map((question, index) => (
                    question.type === "multiple_choice" ? (
                        <RadioType key={index} currentQuestions={currentQuestions} question_options={question_options} />
                    ) : (
                        question.type === "checkbox" ? (
                            <CheckBoxType key={index} currentQuestions={currentQuestions} question_options={question_options}  />
                        ) : (
                            <InputType key={index} currentQuestions={currentQuestions} />
                            
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
