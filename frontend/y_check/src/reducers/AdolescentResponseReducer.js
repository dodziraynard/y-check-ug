import { 
    ADD_ADOLESCENT_RESPONSE_REQUEST,
    ADD_ADOLESCENT_RESPONSE_SUCCESS,
    ADD_ADOLESCENT_RESPONSE_FAILED,
    ADOLESCENT_RESPONSE_LIST_REQUEST,
    ADOLESCENT_RESPONSE_LIST_SUCCESS,
    ADOLESCENT_RESPONSE_LIST_FAILED,
 } from "../constants/AdolescentResponseConstant";


 // ADOLESCENT RESPONSES REDUCER
export const adolescent_response_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ADD_ADOLESCENT_RESPONSE_REQUEST:
            return{loading:true}

        case ADD_ADOLESCENT_RESPONSE_SUCCESS:
            return {loading:false, responses:action.payload}

        case ADD_ADOLESCENT_RESPONSE_FAILED:
            return {loading:false, error:action.payload}


        default:
            return state
    }
}

// ADOLESCENT RESPONSE LIST   REDUCER
export const adoloscent_response_list_reducer = (state = {adolescent_responses:[]},action)=>{
    switch(action.type){
        case ADOLESCENT_RESPONSE_LIST_REQUEST:
            return{...state,loading:true,adolescent_responses:[]}

        case ADOLESCENT_RESPONSE_LIST_SUCCESS:
            return {...state,loading:false,adolescent_responses:action.payload}

        case ADOLESCENT_RESPONSE_LIST_FAILED:
            return {...state,loading:false,error:action.payload}

        default:
            return state
    }
}

