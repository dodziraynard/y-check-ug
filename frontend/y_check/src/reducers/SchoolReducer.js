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


// BASIC SCHOOL LIST   REDUCER
export const basic_school_list_reducer = (state = {schools:[]},action)=>{
    switch(action.type){
        case BASIC_SCHOOL_REQUEST:
            return{loading:true,schools:[]}

        case BASIC_SCHOOL_SUCCESS:
            return {loading:false,schools:action.payload}

        case BASIC_SCHOOL_FAILED:
            return {loading:false,error:action.payload}

        default:
            return state
    }
}
// SHS SCHOOL  REDUCER
export const shs_school_reducer = (state = {} ,action)=>{
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


// SHS SCHOOL LIST   REDUCER
export const shs_school_list_reducer = (state = {schools:[]},action)=>{
    switch(action.type){
        case BASIC_SCHOOL_REQUEST:
            return{loading:true,schools:[]}

        case BASIC_SCHOOL_SUCCESS:
            return {loading:false,schools:action.payload}

        case BASIC_SCHOOL_FAILED:
            return {loading:false,error:action.payload}

        default:
            return state
    }
}
// COMMUNITY  REDUCER
export const community_reducer = (state = {} ,action)=>{
    switch(action.type){
        case BASIC_SCHOOL_REQUEST:
            return{loading:true}

        case BASIC_SCHOOL_SUCCESS:
            return {loading:false, community_name:action.payload}

        case  BASIC_SCHOOL_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}


// COMMUNITY LIST   REDUCER
export const community_list_reducer = (state = {communities:[]},action)=>{
    switch(action.type){
        case BASIC_SCHOOL_REQUEST:
            return{loading:true,communities:[]}

        case BASIC_SCHOOL_SUCCESS:
            return {loading:false,communities:action.payload}

        case BASIC_SCHOOL_FAILED:
            return {loading:false,error:action.payload}

        default:
            return state
    }
}