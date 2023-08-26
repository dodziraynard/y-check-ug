import React from 'react'
import BasicSchoolTableList from '../../../components/schoolList/BasicSchoolTableList';

const handleSubmit = (e) =>{
    e.preventDefault();

}
const CommunityForm = () => {
  return (
    <div>
        <div className='basic_form'>
            <h1>Add Community Form </h1>
        <form className='form-input' onSubmit={handleSubmit}>
            <label htmlFor=""> Community Name</label>
            <input 
            type="text"
            placeholder='Enter Community Name' />
            <button>Add Community </button>
        </form>
        </div>
    <BasicSchoolTableList/>
    </div>
  )
}

export default CommunityForm
