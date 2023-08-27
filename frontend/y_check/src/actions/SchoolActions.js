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