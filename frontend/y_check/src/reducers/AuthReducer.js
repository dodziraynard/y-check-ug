import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_REGISTRATION_REQUEST,
    USER_REGISTRATION_SUCCESS,
    USER_REGISTRATION_FAILED,

    USER_LOGOUT
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