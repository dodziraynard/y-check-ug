import React, {useState,useEffect} from 'react'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import person from '../../images/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
import './nav.scss'
import Icon from '@mdi/react';
import { mdiMagnify,mdiBellOutline} from '@mdi/js';
import { get_user_search } from '../../actions/userActions';
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function Nav() {
  const [search, setSearch] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const user_search_list = useSelector(state => state.user_search_list);
  const { error } = user_search_list;

  const handleInputChange = event => {
    setSearch(event.target.value);
  };
// HANDLE FORM SUBMIT 
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(search)
    dispatch(get_user_search(search))

// Clear input fields after form submission
    setSearch("");
  }
  useEffect(() => {
    if (error) {
        setShowSuccessMessage(true);
        
        const timer = setTimeout(() => {
            setShowSuccessMessage(false); // Hide the success message after 20 seconds
        }, 1000); 

        return () => clearTimeout(timer);
    } 
  }, [error]);
  

    return (
        <div className="navbar">
          {/* Logo */}
          <div className="logo">
            <img src={ug_logo} alt="Logo" />
            <span>Y-CHECK-GHANA</span>
          </div>
    
          {/* Search Bar */}
          <form className="search-bar">
          {showSuccessMessage? <span className='login-error'>{error}</span>:''}
            <Icon path={mdiMagnify} size={1} className="search-icon"  onClick={handleSubmit}/>
            <input 
            type="text" 
            placeholder="Search for users..." 
            className="search-input" 
            value={search}
            onChange={handleInputChange}
            required/>
          </form>
    
          {/* Person Picture with Dropdown */}
          <div className="person">
            <Icon className='notification' path={mdiBellOutline} size={1} />
    
            <span>louis seyram</span>
            <img src={person} alt="Logo" />
          </div>
        </div>
    );
}

export default Nav
