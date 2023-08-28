import {legacy_createStore as createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { user_login_reducer,user_registrstion_reducer } from '../reducers/AuthReducer'
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
    get_adolescent_reducer
} from '../reducers/AddAdolescentReducer'

// COMBINE REDUCERS START
const reducer = combineReducers({
    // USER REDUCER
    user_login: user_login_reducer,
    user_registration:user_registrstion_reducer,
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
    get_adolescent:get_adolescent_reducer
})

const userInfoFromStorage = localStorage.getItem('userInfo')?
    JSON.parse(localStorage.getItem('userInfo')):null

const initailState = {
    user_login:{userInfo:userInfoFromStorage}
}

const midlleWare = [thunk]


const store = createStore(reducer, initailState ,
    composeWithDevTools(applyMiddleware(...midlleWare)))


export default store