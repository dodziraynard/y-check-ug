import React, {useState,useEffect} from 'react'
import { add_shs_school } from '../../../actions/SchoolActions';
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import SHSTableList from '../../../components/schoolList/SHSTableList';
// MAIN FUNCTION
const SHSForm = () => {
    const [shs, setShs] = useState('')
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
    const dispatch = useDispatch()
    const navigate = useNavigate();
  
    // GET THE ADDED SCHOOL
    const shs_school = useSelector(state => state.shs_school);
    const { error, school } = shs_school;
  
    
    const handleChange = (event) => {
        let value = event.target.value;
        setShs(value);
      };

    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(add_shs_school(shs))
        setShs("")
    
    }

    useEffect(() => {
        if (school) {
            setShowSuccessMessage(true);
            
            const timer = setTimeout(() => {
                setShowSuccessMessage(false); // Hide the success message after 20 seconds
                navigate('/add_shs');
            }, 1000); 
    
            return () => clearTimeout(timer);
        }
    }, [school, navigate]);
      
    
    return (
        <div>
            <div className='basic_form'>
            {error && Object.keys(error).map((field) => (
            <span key={field} className='login-error'>
                {`${field}: ${error[field]}`}
            </span>
            ))}
            {showSuccessMessage ? <span className='login-success'> School Added Successfully</span> : ''}
                <h1>Add Senior School Form </h1>
            <form className='form-input' onSubmit={handleSubmit}>
                <label htmlFor=""> School Name</label>
                <input 
                type="text"
                placeholder='Enter School Name'
                name="shs"
                value={shs}
                onChange={handleChange} 
                required />
                <button>Add Senior High School</button>
            </form>
            </div>
            <SHSTableList/>
        </div>
  )
}

export default SHSForm
