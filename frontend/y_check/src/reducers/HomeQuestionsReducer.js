import { 
    HOME_QUESTIONS_REQUEST,
    HOME_QUESTIONS_SUCCESS,
    HOME_QUESTIONS_FAILED,
    ADD_HOME_QUESTIONS_REQUEST,
    ADD_HOME_QUESTIONS_SUCCESS,
    ADD_HOME_QUESTIONS_FAILED
 } from "../constants/HomeQuestionsConstants";

 // ADD HOME QUESTION  REDUCER
 export const add_home_question_reducer = (state = {} ,action)=>{
     switch(action.type){
         case ADD_HOME_QUESTIONS_REQUEST:
             return{loading:true}
 
         case ADD_HOME_QUESTIONS_SUCCESS:
             return {loading:false, home:action.payload}
 
         case ADD_HOME_QUESTIONS_FAILED:
             return {loading:false, error:action.payload}
 
         default:
             return state
     }
}


// HOME QUESTIONS  LIST   REDUCER
export const home_questions_list_reducer = (state = {home_questions:[]},action)=>{
    switch(action.type){
        case HOME_QUESTIONS_REQUEST:
            return{...state,loading:true,home_questions:[]}

        case HOME_QUESTIONS_SUCCESS:
            return {...state,loading:false,home_questions:action.payload}

        case HOME_QUESTIONS_FAILED:
            return {...state,loading:false,error:action.payload}

        default:
            return state
    }
}