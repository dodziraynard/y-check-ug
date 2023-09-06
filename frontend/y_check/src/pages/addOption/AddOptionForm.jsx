import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlusBox,mdiMinusBox } from '@mdi/js';
import { add_question } from '../../actions/HomeQuestionsAction';
import { get_home_questions } from '../../actions/HomeQuestionsAction';

const AddOptionForm = () => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [addQuestionOption,setAddQuestionOption] = useState({
    question:"",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate();

  // GET THE ADDED SCHOOL
  const add_home_question = useSelector(state => state.add_home_question);
  const { error, home } = add_home_question;

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
  const handleSubmit = async (e) =>{
    e.preventDefault();
    const formattedOptions = additionalOptions.map((option) => ({
        option_id: option.optionIdValue,
        option: option.optionValue,
        question:addQuestionOption.question,
      }));
    
      // Dispatch the formatted options to your Redux action
      console.log(formattedOptions); 
        
  
    setAdditionalOptions([])
  }

  const addOption = () => {
    setAdditionalOptions([
      ...additionalOptions,
      {
        id: additionalOptions.length, 
        optionIdValue: '', 
        optionValue: '', 
      },
    ]);
  };

  const removeOption = (id) => {
    // Remove the option with the specified ID from the additionalOptions array
    setAdditionalOptions((options) =>
      options.filter((option) => option.id !== id)
    );
  };
  const handleOptionChange = (id, propertyName, e) => {
    // Handle changes in the additional option input fields
    const updatedOptions = additionalOptions.map((option) =>
      option.id === id
        ? { ...option, [propertyName]: e.target.value }
        : option
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
                {error && Object.keys(error).map((field) => (
                <span key={field} className='login-error'>
                    {`${field}: ${error[field]}`}
                </span>
            ))}
            {showSuccessMessage ? <span className='login-success'> School Added Successfully</span> : ''}
            <h1>Add Option Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
        <label style={{marginTop:"10px"}} htmlFor=""> Select Question</label>
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
            {additionalOptions.map((option) => (
            <div key={option.id}>
                <label htmlFor={`option-id${option.id}`}>
                Option ID {option.id + 1}
                </label>
                <input
                type="text"
                placeholder={`Enter Option ID ${option.id + 1}`}
                name={`option-id${option.id}`}
                value={option.optionIdValue}
                onChange={(e) => handleOptionChange(option.id, 'optionIdValue', e)} // Pass 'optionIdValue' as the property name
                required
                />
                <label style={{ marginTop: "20px" }} htmlFor={`option-${option.id}`}>
                Option {option.id + 1}
                </label>
                <input
                type="text"
                placeholder={`Enter Option ${option.id + 1}`}
                name={`option-${option.id}`}
                value={option.optionValue}
                onChange={(e) => handleOptionChange(option.id, 'optionValue', e)} // Pass 'optionValue' as the property name
                required
                />
                <Icon
                style={{ marginTop: "10px" }}
                className='option-plus'
                path={mdiMinusBox}
                size={1}
                onClick={() => removeOption(option.id)}
                />
            </div>
            ))}

          <label style={{ marginTop: "10px" }} htmlFor="add-more-options">
            Add  Options
          </label>
          <Icon className='option-plus' path={mdiPlusBox} size={1} onClick={addOption} />
          <button>Add Option</button>

        </form>
        </div>
    </div>
  )
}

export default AddOptionForm
