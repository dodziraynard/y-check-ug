import axios from 'axios'

import { 
    ADOLESCENT_LIST_REQUEST,
    ADOLESCENT_LIST_SUCCESS,
    ADOLESCENT_LIST_FAILED,
    RESET_ADOLESCENT_INFO,
    ADOLESCENT_DELETE_SUCCESS,
    ADOLESCENT_DELETE_REQUEST,
    ADOLESCENT_DELETE_FAILED,
    ADOLESCENT_REQUEST,
    ADOLESCENT_SUCCESS,
    ADOLESCENT_FAILED
} from "../constants/AddAdolescentConstants";

// GET ALL BASIC SCHOOLS ACTION
export const get_adolescents = () => async (dispatch)=>{
    try {
        dispatch({type:ADOLESCENT_LIST_REQUEST})
        const {data} = await axios.get('http://127.0.0.1:8000/account/Add-adolescent/')
        dispatch({
            type: ADOLESCENT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:ADOLESCENT_LIST_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}
// DELETE ADOLESCENT  ACTION
export const delete_adolescent = (id) => async(dispatch) =>{
    try {
        dispatch({
            type: ADOLESCENT_DELETE_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        await axios.delete(
            `http://127.0.0.1:8000/account/Add-adolescent/${id}`,
            config
        )
        dispatch({
            type: ADOLESCENT_DELETE_SUCCESS,
            payload:id
        })

    } catch (error) {
        dispatch({
            type:ADOLESCENT_DELETE_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}
// GET SINGLE ADOLESCENT  ACTION
export const get_single_adolescent = (id) => async(dispatch) =>{
    try {
        dispatch({
            type: ADOLESCENT_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.get(
            `http://127.0.0.1:8000/account/Add-adolescent/${id}`,
            config
        )
        dispatch({
            type: ADOLESCENT_SUCCESS,
            payload:data
        })
        localStorage.setItem('adolescent',JSON.stringify(data))


    } catch (error) {
        dispatch({
            type:ADOLESCENT_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}

export const resetAdolescentInfo = () => ({
    type: RESET_ADOLESCENT_INFO,
});
