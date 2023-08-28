import axios from 'axios'

import { 
    ADD_ADOLESCENT_REQUEST,
    ADD_ADOLESCENT_SUCCESS,
    ADD_ADOLESCENT_FAILED,
    ADOLESCENT_LIST_REQUEST,
    ADOLESCENT_LIST_SUCCESS,
    ADOLESCENT_LIST_FAILED,
    RESET_ADOLESCENT_INFO
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

export const resetAdolescentInfo = () => ({
    type: RESET_ADOLESCENT_INFO,
});
