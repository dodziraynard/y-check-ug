import { 
    ADD_ADOLESCENT_RESPONSE_REQUEST,
    ADD_ADOLESCENT_RESPONSE_SUCCESS,
    ADD_ADOLESCENT_RESPONSE_FAILED
 } from "../constants/AdolescentResponseConstant";


 // ADOLESCENT REGISTRATION REDUCER
export const adolescent_response_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ADD_ADOLESCENT_RESPONSE_REQUEST:
            return{loading:true}

        case ADD_ADOLESCENT_RESPONSE_SUCCESS:
            return {loading:false, responses:action.payload}

        case ADD_ADOLESCENT_RESPONSE_FAILED:
            return {loading:false, error:action.payload}


        default:
            return state
    }
}
