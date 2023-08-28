import { 
    ADD_ADOLESCENT_REQUEST,
    ADD_ADOLESCENT_SUCCESS,
    ADD_ADOLESCENT_FAILED
} from "../constants/AddAdolescentConstants";

// ADOLESCENT REGISTRACTION ACTION
export const register_adolescent = (
    surname,
    other_names,
    adolescent_type,
    visit_type,
    year,
    consent,
    community,
    check_up_location,
    school,
    resident_status,
    date,
    age_confirmation,
    gender,
    created_by,
) => async(dispatch) =>{
    try {
        dispatch({
            type: ADD_ADOLESCENT_REQUEST,
        })
        const config = {
            headers:{
                'content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            'http://127.0.0.1:8000/account/register-view/',
            {
                "surname": surname,
                "other_names": other_names,
                "adolescent_type": adolescent_type,
                "visit_type":visit_type,
                "year":year,
                "consent":consent,
                "community":community,
                "check_up_location": check_up_location,
                "school": school,
                "resident_status": resident_status,
                "dob": date,
                "age_confirmation":age_confirmation,
                "gender": gender,
                "created_by": created_by,
            },
            config
        )
        dispatch({
            type: ADD_ADOLESCENT_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ADD_ADOLESCENT_FAILED,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
};

