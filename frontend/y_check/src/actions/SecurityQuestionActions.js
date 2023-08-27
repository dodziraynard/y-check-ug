import axios from "axios";
import { 
    SECURITY_QUESTION_REQUEST,
    SECURITY_QUESTION_SUCCESS,
    SECURITY_QUESTION_FAILED
 } from "../constants/SecurityQuestionConstants";



export const get_security_questions = () => async (dispatch)=>{
    try {
        dispatch({type:SECURITY_QUESTION_REQUEST})
        const {data} = await axios.get('http://127.0.0.1:8000/account/all_security_questions/')
        dispatch({
            type: SECURITY_QUESTION_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:SECURITY_QUESTION_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}