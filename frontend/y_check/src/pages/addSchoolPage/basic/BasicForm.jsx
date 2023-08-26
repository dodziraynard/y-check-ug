import React from 'react'
import BasicSchoolTableList from '../../../components/schoolList/BasicSchoolTableList';

const handleSubmit = (e) =>{
    e.preventDefault();

}
const BasicForm = () => {
  return (
    <div>
        <div className='basic_form'>
            <h1>Add Basic School Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> School Name</label>
            <input 
            type="text"
            placeholder='Enter School Name' />
            <button>Add Basic School</button>
        </form>
        </div>
    <BasicSchoolTableList/>
    </div>
  )
}

export default BasicForm
