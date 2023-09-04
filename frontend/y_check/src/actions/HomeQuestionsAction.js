import axios from "axios";
import { BASE_URL } from '../constants/Host';

import { 
    HOME_QUESTIONS_REQUEST,
    HOME_QUESTIONS_SUCCESS,
    HOME_QUESTIONS_FAILED,
    ADD_HOME_QUESTIONS_REQUEST,
    ADD_HOME_QUESTIONS_SUCCESS,
    ADD_HOME_QUESTIONS_FAILED
 } from "../constants/HomeQuestionsConstants";


 export const add_question = (title, type,subtitle,category,options,picture)=> async(dispatch)=>{
    try {
        dispatch({
            type: ADD_HOME_QUESTIONS_REQUEST,
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const { data } = await axios.post(
            `${BASE_URL}/account/home_questions/`,
            {"title":title,"type":type,"subtitle":subtitle, "category":category ,"options":options,"picture":picture},
            config
        );

        dispatch({
            type: ADD_HOME_QUESTIONS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ADD_HOME_QUESTIONS_FAILED,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
 }


 

 export const get_home_questions = () => async (dispatch)=>{
    try {
        dispatch({type:HOME_QUESTIONS_REQUEST})
        const {data} = await axios.get(`${BASE_URL}/account/home_questions/`)
        dispatch({
            type: HOME_QUESTIONS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type:HOME_QUESTIONS_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
        
    }
}
