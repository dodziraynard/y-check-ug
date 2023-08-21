import React, { useState } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import PIP from './PIP';
import Location from './Location';
import Type from './Type';
import './adolescent.scss'
const AddAdolescent = () => {
    const [page, setPage] = useState(0)
    
    const pageTitles = ["Add Adolescent","Add Adolescent ","Add Adolescent "]
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

// HANDLE FORM SUBMIT
    const handleSubmit = (e)=>{
        e.preventDefault();
        
    }
    const displayPage = ()=>{
        return <Type/>
    }

    return (
        <div className='page-progress'>
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
                            <div className='buttons-group password-info'>
                            <button className='register-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                            <button className='register-pre register-next' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</button>
                            </div>
                        ) : (
                            <div className='buttons-group security'>
                            <button className='register-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                            <button className='register-pre register-next'  style={{ cursor: 'pointer' }}>Sign Up</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    
      )
}

export default AddAdolescent
