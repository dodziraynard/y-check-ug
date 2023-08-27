import axios from "axios";
import { 
    BASIC_SCHOOL_REQUEST,
    BASIC_SCHOOL_SUCCESS,
    BASIC_SCHOOL_FAILED
 } from "../constants/SchoolConstants"


// BASIC SCHOOL  ACTION
export const add_basic_school = (school_name) => async(dispatch) =>{
    try {
        dispatch({
            type: BASIC_SCHOOL_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            'http://127.0.0.1:8000/account/basic-school/',
            {'school_name':school_name},
            config
        )
        dispatch({
            type: BASIC_SCHOOL_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

export const get_basic_schools = () => async (dispatch)=>{
    try {
        dispatch({type:BASIC_SCHOOL_REQUEST})
        const {data} = await axios.get('http://127.0.0.1:8000/account/basic-school/')
        dispatch({
            type: BASIC_SCHOOL_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}

// SHS SCHOOL  ACTION
export const add_shs_school = (school_name) => async(dispatch) =>{
    try {
        dispatch({
            type: BASIC_SCHOOL_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            'http://127.0.0.1:8000/account/shs-school/',
            {'school_name':school_name},
            config
        )
        dispatch({
            type: BASIC_SCHOOL_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

export const get_shs_schools = () => async (dispatch)=>{
    try {
        dispatch({type:BASIC_SCHOOL_REQUEST})
        const {data} = await axios.get('http://127.0.0.1:8000/account/shs-school/')
        dispatch({
            type: BASIC_SCHOOL_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}
// COMMUNITY   ACTION
export const add_community = (community_name) => async(dispatch) =>{
    try {
        dispatch({
            type: BASIC_SCHOOL_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            'http://127.0.0.1:8000/account/community/',
            {'community_name':community_name},
            config
        )
        dispatch({
            type: BASIC_SCHOOL_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

export const get_communities = () => async (dispatch)=>{
    try {
        dispatch({type:BASIC_SCHOOL_REQUEST})
        const {data} = await axios.get('http://127.0.0.1:8000/account/community/')
        dispatch({
            type: BASIC_SCHOOL_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}