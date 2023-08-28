import React, { useState,useEffect } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import PIP from './PIP';
import Community from './Community';
import Type from './Type';
import DateOfBirth from './DateOfBirth';
import './adolescent.scss'
import Consent from './Consent';
import School from './School';
import Location from './Location';
import { useSelector,useDispatch } from 'react-redux'
import { get_basic_schools, get_shs_schools, get_communities } from '../../actions/SchoolActions';

//MAIN FUNCTION
const AddAdolescent = () => {
    const [page, setPage] = useState(0)

    const dispatch = useDispatch()

   // GET THE ALL  SCHOOLS
    const basic_school_list = useSelector(state => state.basic_school_list);
    const { schools } = basic_school_list;

    // GET ALL COMMUNITIES 
    const community_list = useSelector(state => state.community_list);
    const { communities } = community_list;

    // GET ALL SENIOR HIGH SCHOOLS 
    const shs_school_list = useSelector(state => state.shs_school_list);
    const { shs_schools } = shs_school_list;


    useEffect(() => {
        dispatch(get_basic_schools());
        dispatch(get_communities())
        dispatch(get_shs_schools())
    }, [dispatch]);
    console.log(shs_schools)


    const [adolescentFormData, setAdolescentFormData] = useState({
        surname:"",
        other_names:"",
        adolescent_type:"",
        visit_type:"",
        year:"",
        consent:"",
        community:"",
        check_up_location:"",
        school:"",
        resident_status:"",
        date: "",
        age_confirmation:"",
        gender:"",
        created_by:"",
        picture:"",
    });
    const pageTitles = ["Add Adolescent","Add Adolescent ","Add Adolescent ","Add Adolescent ","Add Adolescent ","Add Adolescent ","Add Adolescent "]
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
    const { name, value, type, checked } = event.target;

    // Handle radio buttons
    if (type === "radio") {
        setAdolescentFormData({
            ...adolescentFormData,
            [name]: value
        });
    } else {
        // Handle other input types
        setAdolescentFormData({
            ...adolescentFormData,
            [name]: value
        });
    }
};

// HANDLE FORM SUBMIT
    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(
            adolescentFormData.date,
            adolescentFormData.gender,
            adolescentFormData.surname,
            adolescentFormData.other_names,
            adolescentFormData.adolescent_type,
            adolescentFormData.visit_type,
            adolescentFormData.check_up_location,
            adolescentFormData.school
        )
    }
    const displayPage = ()=>{
        if (page === 0){
            return <PIP handleInputChange={handleInputChange} adolescentFormData={adolescentFormData}/>
        }
        else if(page === 1){
            return <Type handleInputChange={handleInputChange} adolescentFormData={adolescentFormData}/>
        }
        else if(page === 2){
            return<Location 
            handleInputChange={handleInputChange} 
            adolescentFormData={adolescentFormData}
            schools={schools}
            shs_schools={shs_schools}
            communities={communities}/>
        } else if(page === 3){
            return<Consent handleInputChange={handleInputChange} adolescentFormData={adolescentFormData}/>
        } else if(page === 4){
            return<Community 
            handleInputChange={handleInputChange} 
            adolescentFormData={adolescentFormData}
            communities={communities}/>
        } else if (page === 5){
            return<School 
            handleInputChange={handleInputChange} 
            adolescentFormData={adolescentFormData}
            schools={schools}
            shs_schools={shs_schools}/>

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
                        {page === totalPages ? (
                            <div className='adolescent-button'>
                                <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                                <button className='adolescent-pre' style={{ cursor: 'pointer' }} type='submit'>Submit</button>
                            </div>
                        ) : page === 0 ? (
                            <button className='login-button' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Proceed</button>
                        ) : (
                            <div className='adolescent-button'>
                                <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }}>Back</button>
                                <button className='adolescent-pre' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    
      )
}

export default AddAdolescent
