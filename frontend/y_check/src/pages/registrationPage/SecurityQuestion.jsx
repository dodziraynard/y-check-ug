import React from 'react'
const SecurityQuestion = ({ formData, handleInputChange }) => {
  return (
    <>
        <div className="input-with-icon">
            <label htmlFor="">Where do you live?</label>
            <input type="text" 
            placeholder='Eg: Mampong'
            name='security_answer_1'
            value={formData.security_answer_1}
            onChange={handleInputChange}
            required />

        </div>
        <div className="input-with-icon">
            <label htmlFor="">What is your favorite food?</label>
            <input type="text" 
            placeholder='Eg: Akple'
            value={formData.security_answer_2}
            onChange={handleInputChange}
            name='security_answer_2'
            required />

        </div>
        
    </>
  )
}

export default SecurityQuestion
