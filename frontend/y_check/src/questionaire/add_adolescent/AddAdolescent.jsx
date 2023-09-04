import React, { useState,useEffect } from 'react';
import axios from 'axios'
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
import { useNavigate } from 'react-router-dom';
import { 
    ADD_ADOLESCENT_REQUEST,
    ADD_ADOLESCENT_SUCCESS,
    ADD_ADOLESCENT_FAILED
 } from '../../constants/AddAdolescentConstants';
import { resetAdolescentInfo } from '../../actions/AddAdolescentAction';
import { BASE_URL } from '../../constants/Host';
//MAIN FUNCTION
const AddAdolescent = () => {
    const [page, setPage] = useState(0)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showSuccessInfo, setShowSuccessInfo] = useState(false); // New state to control the success info visibility

    const dispatch = useDispatch()
    const navigate = useNavigate();

   // GET THE ALL  SCHOOLS
    const basic_school_list = useSelector(state => state.basic_school_list);
    const { schools } = basic_school_list;

    // GET ALL COMMUNITIES 
    const community_list = useSelector(state => state.community_list);
    const { communities } = community_list;

    // GET ALL SENIOR HIGH SCHOOLS 
    const shs_school_list = useSelector(state => state.shs_school_list);
    const { shs_schools } = shs_school_list;


    // ADD ADOLESCENT
    const adolescent_registration = useSelector(state => state.adolescent_registration);
    const { error, adolescent_info } = adolescent_registration;

    // ADD ADOLESCENT
    const user_login = useSelector(state => state.user_login);
    const { userInfo } = user_login;


    useEffect(() => {
        dispatch(get_basic_schools());
        dispatch(get_communities())
        dispatch(get_shs_schools())
    }, [dispatch]);


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
        created_by:userInfo.id,
    });
    // CLEAR FORM

    const clearForm = ()=>{
        setAdolescentFormData({
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
            created_by:""
        })
        setSelectedFile(null)
    }
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
//
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

// HANDLE FILE CASE
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


// HANDLE FORM SUBMIT
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();


        formData.append("surname", adolescentFormData.surname);
        formData.append("other_names", adolescentFormData.other_names);
        formData.append("adolescent_type", adolescentFormData.adolescent_type);
        formData.append("visit_type", adolescentFormData.visit_type);
        formData.append("year", adolescentFormData.year);
        formData.append("consent", adolescentFormData.consent);
        formData.append("community", adolescentFormData.community);
        formData.append("check_up_location", adolescentFormData.check_up_location);
        formData.append("school", adolescentFormData.school);
        formData.append("resident_status", adolescentFormData.resident_status);
        formData.append("dob", adolescentFormData.date);
        formData.append("age_confirmation", adolescentFormData.age_confirmation);
        formData.append("gender", adolescentFormData.gender);
        formData.append("created_by", adolescentFormData.created_by);

        // Append the file to the form data
        formData.append("picture", selectedFile);

        try {
            dispatch({
                type: ADD_ADOLESCENT_REQUEST,
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(
                `${BASE_URL}/account/Add-adolescent/`,
                formData,
                config
            );

            dispatch({
                type: ADD_ADOLESCENT_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: ADD_ADOLESCENT_FAILED,
                payload: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            });
        }

        clearForm()
    };
    
    // METHOD TO DISPLAY PAGE IN MULTI-STAGE
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

            return <DateOfBirth 
            handleInputChange={handleInputChange} 
            adolescentFormData={adolescentFormData}
            handleFileChange={handleFileChange}/>
        }
    }

    useEffect(() => {
        if (adolescent_info) {
            setShowSuccessMessage(true);
            setShowSuccessInfo(true); 
            const timer = setTimeout(() => {
                setShowSuccessMessage(false); 
                setShowSuccessInfo(false);
                navigate('/landing'); 
            }, 6000); // 6000 milliseconds = 1 minute

            return () => clearTimeout(timer);
        }
        dispatch(resetAdolescentInfo());
    }, [adolescent_info, navigate])

   
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
                        {error && Object.keys(error).map((field) => (
                        <span key={field} className='login-error'>
                            {`${field}: ${error[field]}`}
                        </span>
                        ))}
                        {showSuccessMessage ? (
                        <div>
                            <span className='login-success'> School Added Successfully</span>
                            {showSuccessInfo && (
                                <div>
                                    <h4>{adolescent_info.pid}</h4>
                                    <h4>{adolescent_info.surname}</h4>
                                    <h4>{adolescent_info.other_names}</h4>
                                </div>
                            )}
                        </div>
                    ) : ''}
                        {displayPage()}
                        {page === totalPages ? (
                            <div className='adolescent-button'>
                                <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }} type="button">Back</button>
                                <button className='adolescent-pre' style={{ cursor: 'pointer' }} type='submit'>Submit</button>
                            </div>
                        ) : page === 0 ? (
                            <button className='login-button' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Proceed</button>
                        ) : (
                            <div className='adolescent-button'>
                                <button className='adolescent-pre' onClick={handlePrePage} style={{ cursor: 'pointer' }} type="button">Back</button>
                                <button className='adolescent-pre' onClick={handleNextPage} style={{ cursor: 'pointer' }} type="button">Next</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    
      )
}

export default AddAdolescent
