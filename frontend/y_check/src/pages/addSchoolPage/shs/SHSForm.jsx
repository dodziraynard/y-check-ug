import React from 'react'
import BasicSchoolTableList from '../../../components/schoolList/BasicSchoolTableList'

const SHSForm = () => {
    const handleSubmit = (e) =>{
        e.preventDefault();
    
    }
    return (
        <div>
            <div className='basic_form'>
                <h1>Add Senior School Form </h1>
            <form className='form-input' onSubmit={handleSubmit}>
                <label htmlFor=""> School Name</label>
                <input 
                type="text"
                placeholder='Enter School Name' />
                <button>Add Senior High School</button>
            </form>
            </div>
        <BasicSchoolTableList/>
        </div>
  )
}

export default SHSForm
