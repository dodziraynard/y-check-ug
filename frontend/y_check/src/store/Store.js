import {legacy_createStore as createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { user_login_reducer,
    user_registrstion_reducer,
    get_all_users_reducer, 
    user_list_reducer,
    user_delete_reducer,
} from '../reducers/AuthReducer'
import { security_question_list_reducer } from '../reducers/SecurityQuestionReducer'
import { 
    basic_school_reducer,
    basic_school_list_reducer,
    shs_school_reducer,
    shs_school_list_reducer,
    community_list_reducer,
    community_reducer,
    basic_school_delete_reducer,
    community_delete_reducer,
    shs_school_delete_reducer
} from '../reducers/SchoolReducer'

import { 
    adolescent_registration_reducer,
    adoloscent_list_reducer,
    adolescent_delete_reducer,
    get_adolescent_reducer,
    adoloscent_search_list_reducer,
    get_all_adolescent_reducer,
    get_all_adolescent_type_reducer,
} from '../reducers/AddAdolescentReducer'
import { 
    home_questions_list_reducer,
    add_home_question_reducer
} from '../reducers/HomeQuestionsReducer'
import { 
    adolescent_response_reducer,
    adoloscent_response_list_reducer
} from '../reducers/AdolescentResponseReducer'
import { add_option_reducer,question_options_list_reducer } from '../reducers/AddOptionReducer'
// COMBINE REDUCERS START
const reducer = combineReducers({
    // USER REDUCER
    user_login: user_login_reducer,
    user_registration:user_registrstion_reducer,
    get_all_users:get_all_users_reducer,
    user_list:user_list_reducer,
    user_delete:user_delete_reducer,
    // SECURITY QUESTION REDUCER
    all_security_question:security_question_list_reducer,
    // SCHOOLS AND COMMUNITIES 
    basic_school:basic_school_reducer,
    basic_school_list:basic_school_list_reducer,
    shs_school:shs_school_reducer,
    shs_school_list:shs_school_list_reducer,
    community:community_reducer,
    community_list:community_list_reducer,
    basic_school_delete:basic_school_delete_reducer,
    community_delete:community_delete_reducer,
    shs_school_delete:shs_school_delete_reducer,
    // ADOLESECENT REDUCER
    adolescent_registration:adolescent_registration_reducer,
    adoloscent_list:adoloscent_list_reducer,
    adolescent_delete:adolescent_delete_reducer,
    get_adolescent:get_adolescent_reducer,
    adoloscent_search_list:adoloscent_search_list_reducer,
    get_all_adolescent:get_all_adolescent_reducer,
    get_all_adolescent_type:get_all_adolescent_type_reducer,
    // HOME QUESTION REDUCER
    home_questions_list:home_questions_list_reducer,
    add_home_question:add_home_question_reducer,
    adolescent_response:adolescent_response_reducer,
    adoloscent_responses_list:adoloscent_response_list_reducer,
    // OPTION REDUCER
    add_option:add_option_reducer,
    question_options_list:question_options_list_reducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')?
    JSON.parse(localStorage.getItem('userInfo')):null
    
const adolescentInfoFromStorage = localStorage.getItem('adolescent')?
    JSON.parse(localStorage.getItem('adolescent')):null

const adolescent_search_resultsFromStorage = localStorage.getItem('adolescent_search_results')?
    JSON.parse(localStorage.getItem('adolescent_search_results')):[]

const initailState = {
    user_login:{userInfo:userInfoFromStorage},
    get_adolescent:{adolescent:adolescentInfoFromStorage},
    adoloscent_search_list:{adolescent_search_results:adolescent_search_resultsFromStorage}
}

const midlleWare = [thunk]


const store = createStore(reducer, initailState ,
    composeWithDevTools(applyMiddleware(...midlleWare)))


export default store