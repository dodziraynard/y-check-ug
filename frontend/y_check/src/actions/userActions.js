import axios from 'axios'
import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_REGISTRATION_REQUEST,
    USER_REGISTRATION_SUCCESS,
    USER_REGISTRATION_FAILED,
    USER_LOGOUT
 } from "../constants/UserConstants";

// USER LOGIN ACTION
export const login = (staff_id, password) => async(dispatch) =>{
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            'http://127.0.0.1:8000/account/api/login-view/',
            {'username':staff_id,'password':password},
            config
        )
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload:data
        })
        localStorage.setItem('userInfo',JSON.stringify(data))

    } catch (error) {
        dispatch({
            type:USER_LOGIN_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

// USER LOGOUT ACTION
export const logout = ()=>(dispatch) =>{
    localStorage.removeItem('userInfo')
    dispatch({type:USER_LOGOUT})
}


// USER REGISTRACTION ACTION
export const register = (
    staff_id,
    security_question_1,
    security_answer_1,
    security_question_2,
    security_answer_2,
    password
) => async(dispatch) =>{
    try {
        dispatch({
            type: USER_REGISTRATION_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            'http://127.0.0.1:8000/account/register-view/',
            {
                'username':staff_id,
                'security_question_1':security_question_1,
                'security_answer_1':security_answer_1,
                'security_question_2':security_question_2,
                'security_answer_2':security_answer_2,
                'password':password
            },
            config
        )
        dispatch({
            type: USER_REGISTRATION_SUCCESS,
            payload:data
        })
        localStorage.setItem('userInfo',JSON.stringify(data))

    } catch (error) {
        if (error.response && error.response.data && error.response.data.username) {
            // Handle "username already exists" error
            const errorMessage = 'user with this Staff ID already exists.';
            dispatch({
                type: USER_REGISTRATION_FAILED,
                payload: errorMessage
            });
        } else {
            // Handle other errors
            dispatch({
                type: USER_REGISTRATION_FAILED,
                payload: 'An error occurred during registration.'
            });
        }
    }
};

