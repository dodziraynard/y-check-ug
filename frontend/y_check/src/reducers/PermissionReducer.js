import { 
    PERMISSION_LIST_REQUEST,
    PERMISSION_LIST_SUCCESS,
    PERMISSION_LIST_FAILED,
    GET_USERS_FOR_PERMISSION_LIST_REQUEST,
    GET_USERS_FOR_PERMISSION_LIST_SUCCESS,
    GET_USERS_FOR_PERMISSION_LIST_FAILED,
    ASSIGN_PERMISSION_REQUEST,
    ASSIGN_PERMISSION_SUCCESS,
    ASSIGN_PERMISSION_FAILED
 } from "../constants/PermissionConstant";


// PERMISSION   LIST   REDUCER
export const permission_list_reducer = (state = {permissions_results:[]},action)=>{
    switch(action.type){
        case PERMISSION_LIST_REQUEST:
            return{...state,loading:true,permissions_results:[]}

        case PERMISSION_LIST_SUCCESS:
            return {...state,loading:false,permissions_results:action.payload}

        case PERMISSION_LIST_FAILED:
            return {...state,loading:false,error:action.payload}

        default:
            return state
    }
}
// USER FOR PERMISSION   LIST   REDUCER
export const user_for_permission_list_reducer = (state = {permissions_users:[]},action)=>{
    switch(action.type){
        case GET_USERS_FOR_PERMISSION_LIST_REQUEST:
            return{...state,loading:true,permissions_users:[]}

        case GET_USERS_FOR_PERMISSION_LIST_SUCCESS:
            return {...state,loading:false,permissions_users:action.payload}

        case GET_USERS_FOR_PERMISSION_LIST_FAILED:
            return {...state,loading:false,error:action.payload}

        default:
            return state
    }
}


// ASSIGN PERMISSION  REDUCER
export const assign_permission_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ASSIGN_PERMISSION_REQUEST:
            return{loading:true}

        case ASSIGN_PERMISSION_SUCCESS:
            return {loading:false, permisson:action.payload}

        case ASSIGN_PERMISSION_FAILED:
            return {loading:false, error:action.payload}


        default:
            return state
    }
}
