import { 
    PERMISSION_LIST_REQUEST,
    PERMISSION_LIST_SUCCESS,
    PERMISSION_LIST_FAILED,
    GET_USERS_FOR_PERMISSION_LIST_REQUEST,
    GET_USERS_FOR_PERMISSION_LIST_SUCCESS,
    GET_USERS_FOR_PERMISSION_LIST_FAILED,
    ASSIGN_PERMISSION_REQUEST,
    ASSIGN_PERMISSION_SUCCESS,
    ASSIGN_PERMISSION_FAILED,
    GET_USER_PERMISSION_REQUEST,
    GET_USER_PERMISSION_SUCCESS,
    GET_USER_PERMISSION_FAILED,
    REVOKE_PERMISSION_REQUEST,
    REVOKE_PERMISSION_SUCCESS,
    REVOKE_PERMISSION_FAILED
 } from "../constants/PermissionConstant";
import axios from "axios";
import { BASE_URL } from "../constants/Host";

 // GET ALL PERMISSION LIST ACTION
 export const get_permissions_list = () => async(dispatch,getState) =>{
     try {
         dispatch({
             type: PERMISSION_LIST_REQUEST,
         })
         const {
             user_login: { userInfo },
         } = getState()
 
         const config = {
             headers: {
                 'Content-type': 'application/json',
                 Authorization: `Token ${userInfo.token}`
             }
         }
         const {data} = await axios.get(
             `${BASE_URL}/account/permissions/`,
             config
             )
         dispatch({
             type: PERMISSION_LIST_SUCCESS,
             payload:data
         })
 
     } catch (error) {
         dispatch({
             type:PERMISSION_LIST_FAILED,
             payload: error.response && error.response.data.message
             ? error.response.data.message
             : error.message
         })
     }
 }
 // GET ALL PERMISSION LIST ACTION
 export const get_users_for_permissions_list = () => async(dispatch,getState) =>{
     try {
         dispatch({
             type: GET_USERS_FOR_PERMISSION_LIST_REQUEST,
         })
         const {
             user_login: { userInfo },
         } = getState()
 
         const config = {
             headers: {
                 'Content-type': 'application/json',
                 Authorization: `Token ${userInfo.token}`
             }
         }
         const {data} = await axios.get(
             `${BASE_URL}/account/user-for-permissions/`,
             config
             )
         dispatch({
             type: GET_USERS_FOR_PERMISSION_LIST_SUCCESS,
             payload:data
         })
 
     } catch (error) {
         dispatch({
             type:GET_USERS_FOR_PERMISSION_LIST_FAILED,
             payload: error.response && error.response.data.message
             ? error.response.data.message
             : error.message
         })
     }
}


 // ASSIGN PERMISSION ACTION
export const add_permission = (user_id, permissions) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ASSIGN_PERMISSION_REQUEST,
        })
        const {
            user_login: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${userInfo.token}`
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/assign-permissions/`,
            {'user_id':user_id,'permissions':permissions},
            config
        )
        dispatch({
            type: ASSIGN_PERMISSION_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ASSIGN_PERMISSION_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

// GET ALL THE PERMISSIONS OF A USER

 export const get_user_permissions = (id) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: GET_USER_PERMISSION_REQUEST,
        })
        const {
            user_login: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${userInfo.token}`
            }
        }
        const {data} = await axios.get(
            `${BASE_URL}/account/assign/${id}/permissions/`,
            config
        )
        dispatch({
            type: GET_USER_PERMISSION_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:GET_USER_PERMISSION_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

// REVOKE PERMISSION ACTION
export const remove_permission = (user_id, permissions) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: REVOKE_PERMISSION_REQUEST,
        })
        const {
            user_login: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${userInfo.token}`
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/revoke-permissions/`,
            {'user_id':user_id,'permissions':permissions},
            config
        )
        dispatch({
            type: REVOKE_PERMISSION_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:REVOKE_PERMISSION_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}