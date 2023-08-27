import React, {useState} from 'react'
import BasicSchoolTableList from '../../../components/schoolList/BasicSchoolTableList';

const BasicForm = () => {
  const [basic, setBasic] = useState('')

    const handleChange = (event) => {
        let value = event.target.value;
        setBasic(value);
      };

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(basic)
    
    }
  return (
    <div>
        <div className='basic_form'>
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
