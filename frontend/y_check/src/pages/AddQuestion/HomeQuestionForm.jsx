import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import './question.scss'
import Icon from '@mdi/react';
import { mdiPlusBox,mdiMinusBox } from '@mdi/js';
import { add_question } from '../../actions/HomeQuestionsAction';

const HomeQuestionForm = () => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [addQuestion,setAddQuestion] = useState({
      question_cation:"",
      question_title:"",
      question_type:"",
      question_subtitle:"",
      question_category:"",
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
    dispatch(add_question(
        addQuestion.question_cation,
        addQuestion.question_title,
        addQuestion.question_type,
        addQuestion.question_subtitle,
        addQuestion.question_category,
        selectedFile)) 
        
    setAddQuestion({
      question_title:"",
      question_type:"",
      question_subtitle:"",
      question_category:"",
      question_cation:"",
    })
    setSelectedFile(null)
  }

  
  
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
            <h1>Add  Question Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> Question Cation</label>
            <input 
            type="text"
            placeholder='Enter Question Cation'
            name="question_cation" 
            onChange={handleChange}
            value={addQuestion.question_cation}
            required/>
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
            <label style={{marginTop:"10px"}} htmlFor=""> Select Question Category</label>
            <select 
                name="question_category" 
                onChange={handleChange}
                value={addQuestion.question_category}
                required>
                    <option value=""> None</option>
                    <option value="Home"> Home</option>
                    <option value="Education and employment"> Education and employment</option>
                    <option value="Eating"> Eating</option>
                    <option value="Activities and Peers"> Activities and Peers</option>
                    <option value="Drugs and alcohol"> Drugs and alcohol</option>
                    <option value="Sexuality"> Sexuality</option>
                    <option value="Emotions"> Emotions</option>
                    <option value="Safety/Security"> Safety/Security</option>
                    <option value="Oral Hygiene"> Oral Hygiene</option>
                    <option value="Physical health 1"> Physical health 1</option>
                    <option value="Physical health 2"> Physical health 2</option>
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
            <button>Add Question</button>

        </form>
        </div>
    </div>
  )
}

export default HomeQuestionForm
