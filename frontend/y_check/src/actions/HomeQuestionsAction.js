import axios from "axios";
import { 
    HOME_QUESTIONS_REQUEST,
    HOME_QUESTIONS_SUCCESS,
    HOME_QUESTIONS_FAILED
 } from "../constants/HomeQuestionsConstants";


 export const get_home_questions = () => async (dispatch)=>{
    try {
        dispatch({type:HOME_QUESTIONS_REQUEST})
        const {data} = await axios.get('http://127.0.0.1:8000/account/home_questions/')
        dispatch({
            type: HOME_QUESTIONS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:HOME_QUESTIONS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}
