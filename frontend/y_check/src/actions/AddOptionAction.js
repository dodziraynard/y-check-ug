import { 
    ADD_OPTIONS_REQUEST,
    ADD_OPTIONS_SUCCESS,
    ADD_OPTIONS_FAILED
} from "../constants/AddOptionConstants";
import axios from "axios";
import { BASE_URL } from "../constants/Host";

// ADOLESCENT RESPONSE ACTION
export const add_question_option = (options) => async(dispatch) =>{
    try {
        dispatch({
            type: ADD_OPTIONS_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            `${BASE_URL}/account/save_options/`,
            options,
            config
        )
        dispatch({
            type: ADD_OPTIONS_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ADD_OPTIONS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}