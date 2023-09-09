import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_REGISTRATION_REQUEST,
    USER_REGISTRATION_SUCCESS,
    USER_REGISTRATION_FAILED,
    GET_ALL_USERS_REQUEST,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILED,
    GET_TOTAL_USERS_REQUEST,
    GET_TOTAL_USERS_SUCCESS,
    GET_TOTAL_USERS_FAILED,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILED,
    USER_SERACH_REQUEST,
    USER_SERACH_SUCCESS,
    USER_SERACH_FAILED,
    USER_LOGOUT,
    RESET_USER_SEARCH,
 } from "../constants/UserConstants";

 // USER LOGIN REDUCER
 export const user_login_reducer = (state = {} ,action)=>{
    switch(action.type){
        case USER_LOGIN_REQUEST:
            return{loading:true}

        case USER_LOGIN_SUCCESS:
            return {loading:false, userInfo:action.payload}

        case USER_LOGIN_FAILED:
            return {loading:false, error:action.payload}

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}

// USER REGISTRATION REDUCER
 export const user_registrstion_reducer = (state = {} ,action)=>{
    switch(action.type){
        case USER_REGISTRATION_REQUEST:
            return{loading:true}

        case USER_REGISTRATION_SUCCESS:
            return {loading:false, userInfo:action.payload}

        case USER_REGISTRATION_FAILED:
            return {loading:false, error:action.payload}

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}

// GET ALL USERS COUNT REDUCER
export const get_all_users_reducer = (state = {} ,action)=>{
    switch(action.type){
        case GET_ALL_USERS_REQUEST:
            return{loading:true}

        case GET_ALL_USERS_SUCCESS:
            return {loading:false, users:action.payload}

        case GET_ALL_USERS_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}

// USERS  LIST   REDUCER
export const user_list_reducer = (state = {users_list:[]},action)=>{
    switch(action.type){
        case GET_TOTAL_USERS_REQUEST:
            return{...state,loading:true,users_list:[]}

        case GET_TOTAL_USERS_SUCCESS:
            return {...state,loading:false,users_list:action.payload}

        case GET_TOTAL_USERS_FAILED:
            return {...state,loading:false,error:action.payload}

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                users_list: state.users_list.filter(user => user.id !== action.payload),
            };
        default:
            return state
    }
}

// DELETE  USER   REDUCER
export const user_delete_reducer = (state = {} ,action)=>{
    switch(action.type){
        case DELETE_USER_REQUEST:
            return{loading:true}

        case  DELETE_USER_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}

// USER  SEARCH LIST   REDUCER
export const user_search_list_reducer = (state = {users_search_results:[]},action)=>{
    switch(action.type){
        case USER_SERACH_REQUEST:
            return{...state,loading:true,users_search_results:[]}

        case USER_SERACH_SUCCESS:
            return {...state,loading:false,users_search_results:action.payload}

        case USER_SERACH_FAILED:
            return {...state,loading:false,error:action.payload}

        case RESET_USER_SEARCH: // Handle the reset action
        return { ...state, users_search_results: [] };

        default:
            return state
    }
}
