import { 
    ADD_ADOLESCENT_REQUEST,
    ADD_ADOLESCENT_SUCCESS,
    ADD_ADOLESCENT_FAILED,
    RESET_ADOLESCENT_INFO,
    ADOLESCENT_LIST_REQUEST,
    ADOLESCENT_LIST_SUCCESS,
    ADOLESCENT_LIST_FAILED,
    ADOLESCENT_DELETE_SUCCESS,
    ADOLESCENT_DELETE_REQUEST,
    ADOLESCENT_DELETE_FAILED,
    ADOLESCENT_REQUEST,
    ADOLESCENT_SUCCESS,
    ADOLESCENT_FAILED,
    ADOLESCENT_SERACH_REQUEST,
    ADOLESCENT_SERACH_SUCCESS,
    ADOLESCENT_SERACH_FAILED,
    GET_ALL_ADOLESCENT_REQUEST,
    GET_ALL_ADOLESCENT_SUCCESS,
    GET_ALL_ADOLESCENT_FAILED

} from "../constants/AddAdolescentConstants";


// ADOLESCENT REGISTRATION REDUCER
export const adolescent_registration_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ADD_ADOLESCENT_REQUEST:
            return{loading:true}

        case ADD_ADOLESCENT_SUCCESS:
            return {loading:false, adolescent_info:action.payload}

        case ADD_ADOLESCENT_FAILED:
            return {loading:false, error:action.payload}

        case RESET_ADOLESCENT_INFO:
            return { ...state, adolescent_info: null };

        default:
            return state
    }
}

// ADOLESCENT  LIST   REDUCER
export const adoloscent_list_reducer = (state = {adolescents:[]},action)=>{
    switch(action.type){
        case ADOLESCENT_LIST_REQUEST:
            return{...state,loading:true,adolescents:[]}

        case ADOLESCENT_LIST_SUCCESS:
            return {...state,loading:false,adolescents:action.payload}

        case ADOLESCENT_LIST_FAILED:
            return {...state,loading:false,error:action.payload}

        case ADOLESCENT_DELETE_SUCCESS:
            return {
                ...state,
                adolescents: state.adolescents.filter(adolescent => adolescent.id !== action.payload),
            };
        default:
            return state
    }
}

// DELETE  ADOLESCENT   REDUCER
export const adolescent_delete_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ADOLESCENT_DELETE_REQUEST:
            return{loading:true}

        case  ADOLESCENT_DELETE_FAILED:
            return {loading:false, error:action.payload}

        default:
            return state
    }
}

export const get_adolescent_reducer = (state = {} ,action)=>{
    switch(action.type){
        case ADOLESCENT_REQUEST:
            return{loading:true}

        case ADOLESCENT_SUCCESS:
            return {loading:false, adolescent:action.payload}

        case ADOLESCENT_FAILED:
            return {loading:false, error:action.payload}

        case RESET_ADOLESCENT_INFO:
            return { ...state, adolescent_info: null };

        default:
            return state
    }
}


// ADOLESCENT  SEARCH LIST   REDUCER
export const adoloscent_search_list_reducer = (state = {adolescent_search_results:[]},action)=>{
    switch(action.type){
        case ADOLESCENT_SERACH_REQUEST:
            return{...state,loading:true,adolescent_search_results:[]}

        case ADOLESCENT_SERACH_SUCCESS:
            return {...state,loading:false,adolescent_search_results:action.payload}

        case ADOLESCENT_SERACH_FAILED:
            return {...state,loading:false,error:action.payload}

        default:
            return state
    }
}


 // GET ALL ADOLESCENT  REDUCER
 export const get_all_adolescent_reducer = (state = {} ,action)=>{
    switch(action.type){
        case GET_ALL_ADOLESCENT_REQUEST:
            return{loading:true}

        case GET_ALL_ADOLESCENT_SUCCESS:
            return {loading:false, adolescents:action.payload}

        case GET_ALL_ADOLESCENT_FAILED:
            return {loading:false, error:action.payload}


        default:
            return state
    }
}