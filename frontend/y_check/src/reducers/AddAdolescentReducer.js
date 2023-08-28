import { 
    ADD_ADOLESCENT_REQUEST,
    ADD_ADOLESCENT_SUCCESS,
    ADD_ADOLESCENT_FAILED
} from "../constants/AddAdolescentConstants";


// USER REGISTRATION REDUCER
export const adolescent_registration_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ADD_ADOLESCENT_REQUEST:
            return{loading:true}

        case ADD_ADOLESCENT_SUCCESS:
            return {loading:false, adolescent_info:action.payload}

        case ADD_ADOLESCENT_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}