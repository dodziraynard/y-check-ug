import React, {useState} from 'react'
import CommunityableList from '../../../components/schoolList/CommunityTableList';




const CommunityForm = () => {

    const [community, setCommunity] = useState('')

    const handleChange = (event) => {
        let value = event.target.value;
        setCommunity(value);
      };

    const handleSubmit = (e) =>{
        e.preventDefault();
    
    }

  return (
    <div>
        <div className='basic_form'>
            <h1>Add Community Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> Community Name</label>
            <input 
            type="text"
            placeholder='Enter Community Name'
            name="community"
            value={community}
            onChange={handleChange} />
            <button>Add Community </button>
        </form>
        </div>
    <CommunityableList/>
    </div>
  )
}

export default CommunityForm
