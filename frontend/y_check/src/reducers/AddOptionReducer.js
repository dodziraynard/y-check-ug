import { 
    ADD_OPTIONS_REQUEST,
    ADD_OPTIONS_SUCCESS,
    ADD_OPTIONS_FAILED,
    GET_QUESTION_OPTIONS_REQUEST,
    GET_QUESTION_OPTIONS_SUCCESS,
    GET_QUESTION_OPTIONS_FAILED
} from "../constants/AddOptionConstants";

// ADD OPTIONS  REDUCER
 export const add_option_reducer = (state = {} ,action)=>{
     switch(action.type){
         case ADD_OPTIONS_REQUEST:
             return{loading:true}
 
         case ADD_OPTIONS_SUCCESS:
             return {loading:false, options:action.payload}
 
         case ADD_OPTIONS_FAILED:
             return {loading:false, error:action.payload}
 
         default:
             return state
     }
}

// GET QUESTION LIST OPTIONS  REDUCER
export const question_options_list_reducer = (state = {question_options:[]},action)=>{
    switch(action.type){
        case GET_QUESTION_OPTIONS_REQUEST:
            return{...state,loading:true,question_options:[]}

        case GET_QUESTION_OPTIONS_SUCCESS:
            return {...state,loading:false,question_options:action.payload}

        case GET_QUESTION_OPTIONS_FAILED:
            return {...state,loading:false,error:action.payload}

        default:
            return state
    }
}
