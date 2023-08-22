import React, { useState } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import PIP from './PIP';
import Location from './Location';
import Type from './Type';
import DateOfBirth from './DateOfBirth';
import './adolescent.scss'

//MAIN FUNCTION
const AddAdolescent = () => {
    const [page, setPage] = useState(0)
    const [adolescentFormData, setAdolescentFormData] = useState({
        date: "",
        
        
    });
    const pageTitles = ["Add Adolescent","Add Adolescent ","Add Adolescent ","Add Adolescent "]
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

// HANDLE INPUT CHANGED
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAdolescentFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        }));
    };
// HANDLE FORM SUBMIT
    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(
            adolescentFormData.date
        )
    }
    const displayPage = ()=>{
        if (page === 0){
            return <PIP/>
        }
        else if(page === 1){
            return <Type/>
        }
        else if(page === 2){
            return<Location/>
        }
        else{

            return <DateOfBirth handleInputChange={handleInputChange} adolescentFormData={adolescentFormData}/>
        }
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
                        ) :(
                            <div className='adolescent-button'>
                            <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                            <button className='adolescent-pre ' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    
      )
}

export default AddAdolescent
