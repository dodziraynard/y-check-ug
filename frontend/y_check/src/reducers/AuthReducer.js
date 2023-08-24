import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_LOGOUT
 } from "../constants/UserConstants";

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