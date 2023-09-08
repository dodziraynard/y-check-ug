import axios from 'axios'
import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_REGISTRATION_REQUEST,
    USER_REGISTRATION_SUCCESS,
    USER_REGISTRATION_FAILED,
    GET_ALL_USERS_REQUEST,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILED,
    GET_TOTAL_USERS_REQUEST,
    GET_TOTAL_USERS_SUCCESS,
    GET_TOTAL_USERS_FAILED,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILED,
    USER_SERACH_REQUEST,
    USER_SERACH_SUCCESS,
    USER_SERACH_FAILED,
    RESET_USER_SEARCH,
    USER_LOGOUT
} from "../constants/UserConstants";
import { BASE_URL } from '../constants/Host';

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
            `${BASE_URL}/account/login-view/`,
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
            `${BASE_URL}/account/register-view/`,
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
    } catch (error) {
        dispatch({
            type: USER_REGISTRATION_FAILED,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// GET ALL USER  ACTION
export const get_total_users = () => async(dispatch) =>{
    try {
        dispatch({
            type: GET_ALL_USERS_REQUEST,
        })
        
        const {data} = await axios.get(
            `${BASE_URL}/account/getAllUsers/`)
        dispatch({
            type: GET_ALL_USERS_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:GET_ALL_USERS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}
// GET ALL USER LIST ACTION
export const get_user_list = (user) => async(dispatch) =>{
    try {
        dispatch({
            type: GET_TOTAL_USERS_REQUEST,
        })
        
        const {data} = await axios.get(
            `${BASE_URL}/account/UserView?user=${user}`)
        dispatch({
            type: GET_TOTAL_USERS_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:GET_TOTAL_USERS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

// DELETE USER  ACTION
export const delete_user = (id) => async(dispatch) =>{
    try {
        dispatch({
            type: DELETE_USER_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        await axios.delete(
            `${BASE_URL}/account/UserView/${id}/`,
            
            config
        )
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload:id
        })

    } catch (error) {
        dispatch({
            type:DELETE_USER_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

// GET ALL  USER SERCH ACTION
export const get_user_search = (user) => async (dispatch)=>{
    try {
        dispatch({type:USER_SERACH_REQUEST})
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(`${BASE_URL}/account/UserView/search/ `,
        {'user':user},
        config
        )
      
        dispatch({
            type: USER_SERACH_SUCCESS,
            payload: data
        })
        localStorage.setItem('users_search_results',JSON.stringify(data))

    } catch (error) {
        dispatch({
            type:USER_SERACH_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}

export const resetSearchResults = ()=>(dispatch) =>{
    localStorage.removeItem('users_search_results')
    dispatch({type:RESET_USER_SEARCH})
}
