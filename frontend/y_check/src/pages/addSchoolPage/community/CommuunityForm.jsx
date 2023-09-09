import React, {useState,useEffect} from 'react'
import { add_community } from '../../../actions/SchoolActions';
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import CommunityableList from '../../../components/schoolList/CommunityTableList';
// MAIN FUNCTION
const CommunityForm = () => {

    const [community, setCommunity] = useState('')

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
    const dispatch = useDispatch()
    const navigate = useNavigate();
  
    // GET THE ADDED SCHOOL
    const get_community = useSelector(state => state.community);
    const { error, community_name } = get_community;
    const handleChange = (event) => {
        let value = event.target.value;
        setCommunity(value);
      };

    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(add_community(community))
        setCommunity("")
    
    }

    useEffect(() => {
      if (community_name) {
          setShowSuccessMessage(true);
          
          const timer = setTimeout(() => {
              setShowSuccessMessage(false); // Hide the success message after 20 seconds
          }, 1000); 
          window.location.reload()

          return () => clearTimeout(timer);
      }
    }, [community_name, navigate]);

  return (
    <div>
        <div className='basic_form community-form'>
        {error && Object.keys(error).map((field) => (
          <span key={field} className='login-error'>
              {`${field}: ${error[field]}`}
          </span>
          ))}
          {showSuccessMessage ? <span className='login-success'> Community Added Successfully</span> : ''}
          <h1>Add Community Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> Community Name</label>
            <input 
            type="text"
            placeholder='Enter Community Name'
            name="community"
            value={community}
            onChange={handleChange} 
            required/>
            <button>Add Community </button>
        </form>
        </div>
        <CommunityableList/>
    </div>
  )
}

export default CommunityForm
