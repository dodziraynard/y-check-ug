import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlusBox,mdiMinusBox } from '@mdi/js';
import { add_question } from '../../actions/HomeQuestionsAction';

const AddOptionForm = () => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate();

  // GET THE ADDED SCHOOL
  const add_home_question = useSelector(state => state.add_home_question);
  const { error, home } = add_home_question;
  

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const optionsArray = additionalOptions.map((option) => option.value); 
    dispatch(add_question()) 
        
  
    setAdditionalOptions([])
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
                {error && Object.keys(error).map((field) => (
                <span key={field} className='login-error'>
                    {`${field}: ${error[field]}`}
                </span>
            ))}
            {showSuccessMessage ? <span className='login-success'> School Added Successfully</span> : ''}
            <h1>Add Option Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
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
