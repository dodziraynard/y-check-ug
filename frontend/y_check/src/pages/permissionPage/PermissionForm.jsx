import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlusBox,mdiMinusBox } from '@mdi/js';
import { add_question_option } from '../../actions/AddOptionAction';
import { get_home_questions } from '../../actions/HomeQuestionsAction';

const PermissionForm = () => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [addQuestionOption,setAddQuestionOption] = useState({
    question:"",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate();

  // GET THE ADDED SCHOOL
  const add_option = useSelector(state => state.add_option);
  const { error, options } = add_option;

  const home_questions_list = useSelector(state => state.home_questions_list);
  const { home_questions } = home_questions_list;

  useEffect(() => {
    dispatch(get_home_questions());
  }, [dispatch]);
// HANDLE INPUT CHANGE
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setAddQuestionOption({ ...addQuestionOption, [name]: value });
  };
// HANDLE SUBMIT
  
  
  
  

  return (
    <div>
        <div className='basic_form home-question-form'>
                {error && Object.keys(error).map((field) => (
                <span key={field} className='login-error'>
                    {`${field}: ${error[field]}`}
                </span>
            ))}
            {showSuccessMessage ? <span className='login-success'> Options Added Successfully</span> : ''}
            <h1>Add Permission Form </h1>
        <form className='form-input' >
        <label style={{marginTop:"10px"}} htmlFor=""> Select User</label>
            <select 
                name="question" 
                onChange={handleChange}
                value={addQuestionOption.question}
                required>
                <option value=""> None</option>
                {home_questions.map((question, index) => (
                <option key={index} value={question.id}>
                {question.title}
                </option>
                ))}
            </select>
            
          <button>Add Option</button>

        </form>
        </div>
    </div>
  )
}

export default PermissionForm
