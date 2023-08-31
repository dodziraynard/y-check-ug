import React, { useState,useEffect } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { Link,useParams } from 'react-router-dom';
import { get_single_adolescent } from '../../actions/AddAdolescentAction';
import { useDispatch,useSelector } from 'react-redux'

const SearchDetail = () => {

    const params = useParams();
    const id = params.id;
    const dispatch = useDispatch()

    const get_adolescent = useSelector(state => state.get_adolescent)
    const {adolescent} = get_adolescent
   
    ///
    useEffect(()=>{
        dispatch(get_single_adolescent(id))
    },[id])

    return (
        <div className='login' style={{background:"#B5965C"}}>
            
            <div className='login-container'>
                {adolescent && (
                <>
                    <div className='login-image'>
                    <img style={{width:"200px",height:"200px", objectFit:"contain", marginTop:"100px"}} src={adolescent.picture} alt="Logo" />
                    </div>
                    <div className="login-title" style={{fontSize:"12px"}}>
                    <h2>PID: <span style={{color:"#ffffff"}}>{adolescent.pid}</span></h2>
                    <h2>Surname: <span style={{color:"#ffffff"}}>{adolescent.surname}</span></h2>
                    <h2>Other Names: <span style={{color:"#ffffff"}}>{adolescent.other_names}</span></h2>
                    </div>
                </>
                )}
                <form className="login-form">
                <Link to='/practice-question-1'> <button className='login-button'> Proceed</button></Link>
                <Link to="/section_1_Search"> <button className='login-button'> Back to Search</button></Link>
                </form>
            </div>
        </div>

           
    );
}

export default SearchDetail
