import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import './question.scss'
import Icon from '@mdi/react';
import axios from 'axios';
import { BASE_URL } from '../../constants/Host';
import { mdiPlusBox,mdiMinusBox } from '@mdi/js';
import { add_question } from '../../actions/HomeQuestionsAction';
import { 
    ADD_HOME_QUESTIONS_REQUEST,
    ADD_HOME_QUESTIONS_SUCCESS,
    ADD_HOME_QUESTIONS_FAILED
} from '../../constants/HomeQuestionsConstants';
import AddQuestion from './AddQuestion';
const HomeQuestionForm = () => {

  const [basic, setBasic] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [addQuestion,setAddQuestion] = useState({
      question_title:"",
      question_type:"",
      question_subtitle:"",
    })
    
    

  const dispatch = useDispatch()
  const navigate = useNavigate();

  // GET THE ADDED SCHOOL
  const add_home_question = useSelector(state => state.add_home_question);
  const { error, home } = add_home_question;


  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setAddQuestion({ ...addQuestion, [name]: value });
  };

  // HANDLE FILE CASE
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const optionsArray = additionalOptions.map((option) => option.value); 
    const optionsJSON = JSON.stringify(optionsArray);
 
    dispatch(add_question(
        addQuestion.question_title,
        addQuestion.question_type,
        addQuestion.question_subtitle,
        optionsJSON,
        selectedFile))    
  }

  const addOption = () => {
    // Create a new input field and add it to the additionalOptions array
    setAdditionalOptions([
      ...additionalOptions,
      {
        id: additionalOptions.length, // Unique ID for each option
        value: '',
      },
    ]);
  };

  const removeOption = (id) => {
    // Remove the option with the specified ID from the additionalOptions array
    setAdditionalOptions((options) => options.filter((option) => option.id !== id));
  };

  const handleOptionChange = (id, e) => {
    // Handle changes in the additional option input fields
    const updatedOptions = additionalOptions.map((option) =>
      option.id === id ? { ...option, value: e.target.value } : option
    );
    setAdditionalOptions(updatedOptions);
  };

  
  useEffect(() => {
    if (home) {
        setShowSuccessMessage(true);
        
        const timer = setTimeout(() => {
            setShowSuccessMessage(false); // Hide the success message after 20 seconds
            navigate('/add_question');
        }, 1000); 

        return () => clearTimeout(timer);
    }
  }, [home, navigate]);
  
  

  return (
    <div>
        <div className='basic_form home-question-form'>
            {error? <span className='login-error'>{error}</span>:''}
            {showSuccessMessage ? <span className='login-success'> School Added Successfully</span> : ''}
            <h1>Add Home Question Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> Question Title</label>
            <input 
            type="text"
            placeholder='Enter Question Title'
            name="question_title" 
            onChange={handleChange}
            value={addQuestion.question_title}
            required/>
            <label style={{marginTop:"10px"}} htmlFor=""> Select Question Type</label>
            <select 
                name="question_type" 
                onChange={handleChange}
                value={addQuestion.question_type}
                required>
                    <option value=""> None</option>
                    <option value="multiple_choice"> Multiple Choice</option>
                    <option value="checkbox">CheckBox</option>
                    <option value="text"> Input Text</option>
            </select>
            <label style={{marginTop:"10px"}}  htmlFor=""> Question Subtitle </label>
            <input 
            type="text"
            placeholder='Enter Question Subtitle'
            name="question_subtitle"
            onChange={handleChange}
            value={addQuestion.question_subtitle}
            required/>
            <label style={{marginTop:"10px"}}  htmlFor=""> Choose file </label>
            <input 
            type="file"
            name="picture"
            onChange={handleFileChange}
            />

            {additionalOptions.map((option) => (
            <div key={option.id}>
              <label style={{ marginTop: "20px" }} htmlFor={`option-${option.id}`}>
                Option {option.id + 1}
              </label>
              <input
                type="text"
                placeholder={`Enter Option ${option.id + 1}`}
                name={`option-${option.id}`}
                value={option.value}
                onChange={(e) => handleOptionChange(option.id, e)}
                required
              />
              <Icon style={{ marginTop: "10px" }}  className='option-plus' path={mdiMinusBox} size={1} onClick={() => removeOption(option.id)} />
            </div>
          ))}
          <label style={{ marginTop: "10px" }} htmlFor="add-more-options">
            Add More Options
          </label>
          <Icon className='option-plus' path={mdiPlusBox} size={1} onClick={addOption} />
          <button>Add Question</button>

        </form>
        </div>
    </div>
  )
}

export default HomeQuestionForm
