import React, { useState,useEffect } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import Password from './Password';
import SecurityQuestion from './SecurityQuestion';
import './register.scss'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { register } from '../../actions/userActions';
import { get_security_questions } from '../../actions/SecurityQuestionActions';

const Register = () => {
    const [page, setPage] = useState(0)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate();

    // GETTING THE SECURITY QUESTIONS FROM THE SERVER

    const all_security_question = useSelector(state => state.all_security_question);
    const { security_questions } = all_security_question;

    useEffect(() => {
        dispatch(get_security_questions());
    }, [dispatch]);

    const firstSecurityQuestion = security_questions[0];
    const secondSecurityQuestion = security_questions[1];

    let security_question_1= null;
    let security_question_2= null;
    if (security_questions && security_questions.length > 0) {
        security_question_1 = security_questions[0].id;
        security_question_2 = security_questions[1].id;
    }



    // GETTING THE STATE FROM THE STORE 
    const user_registration = useSelector(state => state.user_registration)
    const { error, loading, userInfo } = user_registration

    const pageTitles = ["Personal Information","Security Questions"]
    const totalPages = pageTitles.length - 1 // get the total number of pages
// HANGLE PAGE CHANGE
    const handlePageChange = pageNumber => {
        if (pageNumber >= 0 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    };
// HANDLE THE NEXT PAGE
    const handleNextPage = () => {
        handlePageChange(page + 1);
    };
// HANDLE THE PREVIOUS PAGE
    const handlePrePage = () => {
        handlePageChange(page - 1);
    };
// useState FOR THE VARIOUS USER INPUT FIELDS
    const [formData, setFormData] = useState({
        staff_id: "",
        password:"",
        confirm_password:"",
        security_answer_1:"",
        security_answer_2:"",
    });
// HANDLE INPUT CHANGED
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        }));
    };
// HANDLE FORM SUBMIT
    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(formData.security_answer_1)
        dispatch(register(
            formData.staff_id,
            security_question_1,
            formData.security_answer_1,
            security_question_2,
            formData.security_answer_2,
            formData.password
        ))

    }

// FUNCTION REDIRECT THE USER
    useEffect(() => {
        if (userInfo) {
            setShowSuccessMessage(true);
// Delay the redirection to allow the user to see the message
            const timer = setTimeout(() => {
                navigate('/landing');
            }, 1000); 
            return () => clearTimeout(timer);
        } 
    }, [userInfo, navigate]);


    const displayPage = ()=>{
        if(page === 0){
            return<Password handleInputChange={handleInputChange} formData={formData} />
        }else{
            return<SecurityQuestion 
            handleInputChange={handleInputChange} 
            formData={formData} 
            firstSecurityQuestion={firstSecurityQuestion}
            secondSecurityQuestion={secondSecurityQuestion}/>
        }
    }
    return (
        <div className='page-progress'>
            {page === 0 ? (
                <span className='page'>page 1/2</span>
            ) : (
                <span className='page'>page 2/2</span>

            )}
    
            <div className='login'>
            
                <div className='login-container'>
                    <div className='login-image'>
                        <img src={ug_logo} alt="Logo" />
                    </div>
                    <div className="login-title">
                        <h2>{pageTitles[page]}</h2>
                    </div>
                    {error? <span className='login-error'>{error}</span>:''}
                    {showSuccessMessage ? <span className='login-success'> Login Successful</span> : ''}
                    <form className="login-form" onSubmit={handleSubmit}>
                        {displayPage()}
                        {page === 0 ? (
                            <button className='login-button'  onClick={handleNextPage} style={{ cursor: 'pointer' }}>Proceed</button>
                        ) : (
                            <div className='adolescent-button'>
                            <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                            <button className='adolescent-pre' style={{ cursor: 'pointer' }}>Sign Up</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    
      )
}

export default Register
