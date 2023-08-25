import {legacy_createStore as createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { user_login_reducer,user_registrstion_reducer } from '../reducers/AuthReducer'

const reducer = combineReducers({
    user_login: user_login_reducer,
    user_registration:user_registrstion_reducer,
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