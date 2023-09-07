import axios from "axios";
import { BASE_URL } from '../constants/Host';

import { 
    BASIC_SCHOOL_REQUEST,
    BASIC_SCHOOL_SUCCESS,
    BASIC_SCHOOL_FAILED,
    BASIC_SCHOOL_DELETE_REQUEST,
    BASIC_SCHOOL_DELETE_SUCCESS,
    BASIC_SCHOOL_DELETE_FAILED,
    BASIC_SCHOOL_LIST_REQUEST,
    BASIC_SCHOOL_LIST_SUCCESS,
    BASIC_SCHOOL_LIST_FAILED,

    COMMUNITY_REQUEST,
    COMMUNITY_SUCCESS,
    COMMUNITY_FAILED,
    COMMUNITY_LIST_REQUEST,
    COMMUNITY_LIST_SUCCESS,
    COMMUNITY_LIST_FAILED,
    COMMUNITY_DELETE_REQUEST,
    COMMUNITY_DELETE_SUCCESS,
    COMMUNITY_DELETE_FAILED,

    SHS_SCHOOL_REQUEST,
    SHS_SCHOOL_SUCCESS,
    SHS_SCHOOL_FAILED,
    SHS_SCHOOL_LIST_REQUEST,
    SHS_SCHOOL_LIST_SUCCESS,
    SHS_SCHOOL_LIST_FAILED,
    SHS_SCHOOL_DELETE_REQUEST,
    SHS_SCHOOL_DELETE_SUCCESS,
    SHS_SCHOOL_DELETE_FAILED
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
            `${BASE_URL}/account/basic-school/`,
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
// GET ALL BASIC SCHOOLS ACTION
export const get_basic_schools = () => async (dispatch)=>{
    try {
        dispatch({type:BASIC_SCHOOL_LIST_REQUEST})
        const {data} = await axios.get(`${BASE_URL}/account/basic-school/`)
        dispatch({
            type: BASIC_SCHOOL_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_LIST_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}

// BASIC DELETE  SCHOOL ACTION
export const delete_basic_school = (id) => async(dispatch) =>{
    try {
        dispatch({
            type: BASIC_SCHOOL_DELETE_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        await axios.delete(
            `${BASE_URL}/account/basic-school/${id}`,
            config
        )
        dispatch({
            type: BASIC_SCHOOL_DELETE_SUCCESS,
            payload:id
        })

    } catch (error) {
        dispatch({
            type:BASIC_SCHOOL_DELETE_FAILED,
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
            type: SHS_SCHOOL_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/shs-school/`,
            {'school_name':school_name},
            config
        )
        dispatch({
            type: SHS_SCHOOL_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:SHS_SCHOOL_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

export const get_shs_schools = () => async (dispatch)=>{
    try {
        dispatch({type:SHS_SCHOOL_LIST_REQUEST})
        const {data} = await axios.get(`${BASE_URL}/account/shs-school/`)
        dispatch({
            type: SHS_SCHOOL_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:SHS_SCHOOL_LIST_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}

// SHS DELETE  SCHOOL ACTION
export const delete_shs_school = (id) => async(dispatch) =>{
    try {
        dispatch({
            type: SHS_SCHOOL_DELETE_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        await axios.delete(
            `${BASE_URL}/account/shs-school/${id}`,
            config
        )
        dispatch({
            type: SHS_SCHOOL_DELETE_SUCCESS,
            payload:id
        })

    } catch (error) {
        dispatch({
            type:SHS_SCHOOL_DELETE_FAILED,
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
            type: COMMUNITY_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/community/`,
            {'community_name':community_name},
            config
        )
        dispatch({
            type: COMMUNITY_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:COMMUNITY_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

export const get_communities = () => async (dispatch)=>{
    try {
        dispatch({type:COMMUNITY_LIST_REQUEST})
        const {data} = await axios.get(`${BASE_URL}/account/community/`)
        dispatch({
            type: COMMUNITY_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:COMMUNITY_LIST_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}

// DELETE COMMUNITY  ACTION
export const delete_community = (id) => async(dispatch) =>{
    try {
        dispatch({
            type: COMMUNITY_DELETE_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        await axios.delete(
            `${BASE_URL}/account/community/${id}`,
            config
        )
        dispatch({
            type: COMMUNITY_DELETE_SUCCESS,
            payload:id
        })

    } catch (error) {
        dispatch({
            type:COMMUNITY_DELETE_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}
