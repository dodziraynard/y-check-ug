import React, {useState} from 'react'
import SHSTableList from '../../../components/schoolList/SHSTableList'

const SHSForm = () => {
    const [shs, setShs] = useState('')

    const handleChange = (event) => {
        let value = event.target.value;
        setShs(value);
      };

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(shs)
    
    }

    
    return (
        <div>
            <div className='basic_form'>
                <h1>Add Senior School Form </h1>
            <form className='form-input' onSubmit={handleSubmit}>
                <label htmlFor=""> School Name</label>
                <input 
                type="text"
                placeholder='Enter School Name'
                name="shs"
                value={shs}
                onChange={handleChange}  />
                <button>Add Senior High School</button>
            </form>
            </div>
        <SHSTableList/>
        </div>
  )
}

export default SHSForm
