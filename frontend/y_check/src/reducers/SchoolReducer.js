import { 
    BASIC_SCHOOL_REQUEST,
    BASIC_SCHOOL_SUCCESS,
    BASIC_SCHOOL_FAILED
 } from "../constants/SchoolConstants"



// BASIC SCHOOL  REDUCER
export const basic_school_reducer = (state = {} ,action)=>{
    switch(action.type){
        case BASIC_SCHOOL_REQUEST:
            return{loading:true}

        case BASIC_SCHOOL_SUCCESS:
            return {loading:false, school:action.payload}

        case  BASIC_SCHOOL_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}