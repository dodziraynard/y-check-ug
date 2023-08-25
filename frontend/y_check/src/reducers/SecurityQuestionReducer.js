import { 
    SECURITY_QUESTION_REQUEST,
    SECURITY_QUESTION_SUCCESS,
    SECURITY_QUESTION_FAILED
 } from "../constants/SecurityQuestionConstants";


 // SECURITY QUESTIONS LIST
export const security_question_lists = (state = {security_qiestions:[]},action)=>{
    switch(action.type){
        case SECURITY_QUESTION_REQUEST:
            return{loading:true,security_qiestions:[]}

        case SECURITY_QUESTION_SUCCESS:
            return {loading:false,security_qiestions:action.payload}

        case SECURITY_QUESTION_FAILED:
            return {loading:false,error:action.payload}

        default:
            return state
    }
}