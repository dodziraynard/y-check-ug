import React, { useState,useEffect } from 'react';
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { get_adolescent_search } from '../../actions/AddAdolescentAction';
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
const Section_1_Search = () => {
    const [search, setSearch] = useState("");

    const dispatch = useDispatch()
    // GET THE ALL  SCHOOLS
    const adoloscent_search_list = useSelector(state => state.adoloscent_search_list);
    const {error, adolescent_search_results } = adoloscent_search_list;
    
    const handleInputChange = event => {
        setSearch(event.target.value);
    };
    // HANDLE FORM SUBMIT 
    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(get_adolescent_search(search))

// Clear input fields after form submission
        setSearch("");
    }
    return (
        <div className='home'>
            <div className="questionaire-first-circle">
                <form className='questionaire-form' onSubmit={handleSubmit}>
                    <div className="questionaire-input">
                    <div className='login-image' style={{marginTop:"500px",marginBottom:"50px", marginLeft:"30px"}}>
                        <img src={ug_logo} alt="Logo" />
                    </div>
                        <input type="text" 
                        placeholder="Search by PID or Surname"
                        value={search}
                        onChange={handleInputChange}
                        required style={{width:"130%", marginLeft:"-30px",fontSize:"8px"}}/>
                    </div>
                    <button  className='search-button' style={{ cursor: 'pointer' }} type='submit' >Search</button>
                </form>
                <ul className="search-results">
                {error? <span className='login-error'> No matching records found</span>:''}
                    {adolescent_search_results.map(result => (
                        <li key={result.id} className="search-result-item">
                        <span className="name">{result.surname}, {result.other_names}</span>
                        <span className="pid">(PID: {result.pid})</span>
                        <Link to={`/section-detail/${result.id}/`} className="view-link">
                            View
                        </Link>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export default Section_1_Search
