import React, {useState,useEffect} from 'react'
import BasicSchoolTableList from '../../../components/schoolList/BasicSchoolTableList';
import { useSelector,useDispatch } from 'react-redux'
import { add_basic_school } from '../../../actions/SchoolActions';
import { useNavigate } from 'react-router-dom';

const BasicForm = () => {

  const [basic, setBasic] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();


  const all_basic_schools = useSelector(state => state.basic_school);
  const { error, school } = all_basic_schools;


  const handleChange = (event) => {

    let value = event.target.value;
    setBasic(value);
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    dispatch(add_basic_school(basic))
    setBasic("")
  
  }
  useEffect(() => {
    if (school) {
        setShowSuccessMessage(true);
// Delay the redirection to allow the user to see the message
        const timer = setTimeout(() => {
            navigate('/add_school');
        }, 1000); 
        return () => clearTimeout(timer);
    } 
  }, [school, navigate]);   

  return (
    <div>
        <div className='basic_form'>
            {error? <span className='login-error'>{error}</span>:''}
            {showSuccessMessage ? <span className='login-success'> School Added Successfully</span> : ''}
            <h1>Add Basic School Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> School Name</label>
            <input 
            type="text"
            placeholder='Enter School Name'
            name="basic" 
            value={basic}
            onChange={handleChange}/>
            <button>Add Basic School</button>
        </form>
        </div>
    <BasicSchoolTableList/>
    </div>
  )
}

export default BasicForm
