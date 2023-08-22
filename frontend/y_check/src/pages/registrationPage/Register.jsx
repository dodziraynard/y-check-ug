import React, { useState } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { Link } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import Password from './Password';
import SecurityQuestion from './SecurityQuestion';
import './register.scss'

const Register = () => {
    const [page, setPage] = useState(0)
    
    const pageTitles = ["Personal Information","Password Section","Security Questions"]
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
        firstname: "",
        lastname: "",
        phone_number: "",
        password:"",
        confirm_password:"",
        town:"",
        food:"",
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
        console.log(
            formData.staff_id,
            formData.firstname,
            formData.lastname,
            formData.phone_number,
            formData.confirm_password,
            formData.password,
            formData.town,
            formData.food
        )

    }

    const displayPage = ()=>{
        if(page === 0){
            return <PersonalInfo handleInputChange={handleInputChange} formData={formData} />;
        } else if(page === 1){
            return<Password handleInputChange={handleInputChange} formData={formData}/>
        }else{
            return<SecurityQuestion handleInputChange={handleInputChange} formData={formData}/>
        }
    }
    return (
        <div className='page-progress'>
            {page === 0 ? (
                <span className='page'>page 1/3</span>
            ) : page === 1?(
                <span className='page'>page 2/3</span>

            ) : (
                <span className='page'>page 3/3</span>

            )}
    
            <div className='login'>
            
                <div className='login-container'>
                    <div className='login-image'>
                        <img src={ug_logo} alt="Logo" />
                    </div>
                    <div className="login-title">
                        <h2>{pageTitles[page]}</h2>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {displayPage()}
                        {page === 0 ? (
                            <button className='login-button'  onClick={handleNextPage} style={{ cursor: 'pointer' }}>Proceed</button>
                        ) : page === 1?(
                            <div className='adolescent-button'>
                            <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                            <button className='adolescent-pre ' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</button>
                            </div>
                        ) : (
                            <div className='adolescent-button'>
                            <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                            <button className='adolescent-pre'  style={{ cursor: 'pointer' }}>Sign Up</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    
      )
}

export default Register
