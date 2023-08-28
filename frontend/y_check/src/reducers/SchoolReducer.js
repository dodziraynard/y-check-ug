import { 
    BASIC_SCHOOL_REQUEST,
    BASIC_SCHOOL_SUCCESS,
    BASIC_SCHOOL_FAILED,
    BASIC_SCHOOL_DELETE_REQUEST,
    BASIC_SCHOOL_DELETE_SUCCESS,
    BASIC_SCHOOL_DELETE_FAILED,
    BASIC_SCHOOL_LIST_REQUEST,
    BASIC_SCHOOL_LIST_SUCCESS,
    BASIC_SCHOOL_LIST_FAILED,

    COMMUNITY_REQUEST,
    COMMUNITY_SUCCESS,
    COMMUNITY_FAILED,
    COMMUNITY_LIST_REQUEST,
    COMMUNITY_LIST_SUCCESS,
    COMMUNITY_LIST_FAILED,
    COMMUNITY_DELETE_REQUEST,
    COMMUNITY_DELETE_SUCCESS,
    COMMUNITY_DELETE_FAILED,

    SHS_SCHOOL_REQUEST,
    SHS_SCHOOL_SUCCESS,
    SHS_SCHOOL_FAILED,
    SHS_SCHOOL_LIST_REQUEST,
    SHS_SCHOOL_LIST_SUCCESS,
    SHS_SCHOOL_LIST_FAILED,
    SHS_SCHOOL_DELETE_REQUEST,
    SHS_SCHOOL_DELETE_SUCCESS,
    SHS_SCHOOL_DELETE_FAILED
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
export const basic_school_list_reducer = (state = { schools:[ ]},action)=>{
    switch(action.type){
        case BASIC_SCHOOL_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                schools: [],
            };
        case BASIC_SCHOOL_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                schools: action.payload,
            };

        case BASIC_SCHOOL_LIST_FAILED:
            return {
                ...state,
                loading: false,
                schools: action.payload,
            };

        case BASIC_SCHOOL_DELETE_SUCCESS:
            return {
                ...state,
                schools: state.schools.filter(school => school.id !== action.payload),
            };
        

        default:
            return state
    }
}

// BASIC SCHOOL DELETE REDUCER
export const basic_school_delete_reducer = (state = {} ,action)=>{
    switch(action.type){
        case BASIC_SCHOOL_DELETE_REQUEST:
            return{loading:true}

        case  BASIC_SCHOOL_DELETE_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}

// SHS SCHOOL  REDUCER
export const shs_school_reducer = (state = {} ,action)=>{
    switch(action.type){
        case SHS_SCHOOL_REQUEST:
            return{loading:true}

        case SHS_SCHOOL_SUCCESS:
            return {loading:false, school:action.payload}

        case  SHS_SCHOOL_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}


// SHS SCHOOL LIST   REDUCER
export const shs_school_list_reducer = (state = {shs_schools:[]},action)=>{
    switch(action.type){
        case SHS_SCHOOL_LIST_REQUEST:
            return{...state,loading:true,shs_schools:[]}

        case SHS_SCHOOL_LIST_SUCCESS:
            return {...state,loading:false,shs_schools:action.payload}

        case SHS_SCHOOL_LIST_FAILED:
            return {...state,loading:false,error:action.payload}

        case SHS_SCHOOL_DELETE_SUCCESS:
            return {
                ...state,
                shs_schools: state.shs_schools.filter(school => school.id !== action.payload),
            };
        default:
            return state
    }
}

// SNR SCHOOL DELETE REDUCER
export const shs_school_delete_reducer = (state = {} ,action)=>{
    switch(action.type){
        case SHS_SCHOOL_DELETE_REQUEST:
            return{loading:true}

        case  SHS_SCHOOL_DELETE_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}

// COMMUNITY  REDUCER
export const community_reducer = (state = {} ,action)=>{
    switch(action.type){
        case COMMUNITY_REQUEST:
            return{loading:true}

        case COMMUNITY_SUCCESS:
            return {loading:false, community_name:action.payload}

        case  COMMUNITY_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}


// COMMUNITY LIST   REDUCER
export const community_list_reducer = (state = {communities:[]},action)=>{
    switch(action.type){
        case COMMUNITY_LIST_REQUEST:
            return{...state,loading:true,communities:[]}

        case COMMUNITY_LIST_SUCCESS:
            return {...state,loading:false,communities:action.payload}

        case COMMUNITY_LIST_FAILED:
            return {...state, loading:false, error:action.payload}

        case COMMUNITY_DELETE_SUCCESS:
            return {
                ...state,
                communities: state.communities.filter(community => community.id !== action.payload),
            };

        default:
            return state
    }
}

// COMMUNITY DELETE REDUCER
export const community_delete_reducer = (state = {} ,action)=>{
    switch(action.type){
        case COMMUNITY_DELETE_REQUEST:
            return{loading:true}

        case  COMMUNITY_DELETE_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}