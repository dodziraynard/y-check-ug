import { 
    ADD_ADOLESCENT_RESPONSE_REQUEST,
    ADD_ADOLESCENT_RESPONSE_SUCCESS,
    ADD_ADOLESCENT_RESPONSE_FAILED,
    ADOLESCENT_RESPONSE_LIST_REQUEST,
    ADOLESCENT_RESPONSE_LIST_SUCCESS,
    ADOLESCENT_RESPONSE_LIST_FAILED
} from "../constants/AdolescentResponseConstant";
import axios from "axios";
import { BASE_URL } from "../constants/Host";

// ADOLESCENT RESPONSE ACTION
export const add_adolescent_responses = (responses) => async(dispatch) =>{
    try {
        dispatch({
            type: ADD_ADOLESCENT_RESPONSE_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/save_responses/`,
            responses,
            config
        )
        dispatch({
            type: ADD_ADOLESCENT_RESPONSE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ADD_ADOLESCENT_RESPONSE_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}
// GET ADOLESCENT RESPONSES ACTION
export const get_adolescent_responses = (adolescent_id) => async(dispatch) =>{
    try {
        dispatch({
            type: ADOLESCENT_RESPONSE_LIST_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/responses/`,
            {"adolescent_id":adolescent_id},
            config
        )
        dispatch({
            type: ADOLESCENT_RESPONSE_LIST_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ADOLESCENT_RESPONSE_LIST_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}