import React, { useState } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { Link } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import Password from './Password';
import SecurityQuestion from './SecurityQuestion';
import './register.scss'

const Register = () => {
    const [page, setPage] = useState(0)
    
    const pageTitles = ["Sign Up","Personal Info","Security Questions"]
    const totalPages = pageTitles.length - 1
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
    const displayPage = ()=>{
        if(page === 0){
            return < PersonalInfo/>
        } else if(page === 1){
            return<Password/>
        }else{
            return<SecurityQuestion/>
        }
    }
    return (
        <div className='login'>
            <div className='login-container'>
                <div className='login-image'>
                    <img src={ug_logo} alt="Logo" />
                </div>
                <div className="login-title">
                    <h2>{pageTitles[page]}</h2>
                </div>
                <form className="login-form">
                    {displayPage()}
                    {page === 0 ? (
                        <button className='login-button'  onClick={handleNextPage} style={{ cursor: 'pointer' }}>Proceed</button>
                    ) : (
                        <div className='buttons-group'>
                        <button className='register-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                        <button className='register-pre register-next' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    
      )
}

export default Register
