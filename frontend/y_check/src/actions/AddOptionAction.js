import { 
    ADD_OPTIONS_REQUEST,
    ADD_OPTIONS_SUCCESS,
    ADD_OPTIONS_FAILED,
    GET_QUESTION_OPTIONS_REQUEST,
    GET_QUESTION_OPTIONS_SUCCESS,
    GET_QUESTION_OPTIONS_FAILED
} from "../constants/AddOptionConstants";
import axios from "axios";
import { BASE_URL } from "../constants/Host";

// ADD QUESTION OPTION ACTION
export const add_question_option = (options) => async(dispatch) =>{
    try {
        dispatch({
            type: ADD_OPTIONS_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/save_options/`,
            options,
            config
        )
        dispatch({
            type: ADD_OPTIONS_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ADD_OPTIONS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

// GET QUESTION OPTIONS ACTION
export const get_question_options = (question_id) => async(dispatch) =>{
    try {
        dispatch({
            type: GET_QUESTION_OPTIONS_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/get_options/`,
            {"question_id":question_id},
            config
        )
        dispatch({
            type: GET_QUESTION_OPTIONS_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:GET_QUESTION_OPTIONS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}