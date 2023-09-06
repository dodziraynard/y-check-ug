import { 
    ADD_OPTIONS_REQUEST,
    ADD_OPTIONS_SUCCESS,
    ADD_OPTIONS_FAILED
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
