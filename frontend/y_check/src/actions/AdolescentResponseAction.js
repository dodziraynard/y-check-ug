import { 
    ADD_ADOLESCENT_RESPONSE_REQUEST,
    ADD_ADOLESCENT_RESPONSE_SUCCESS,
    ADD_ADOLESCENT_RESPONSE_FAILED
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