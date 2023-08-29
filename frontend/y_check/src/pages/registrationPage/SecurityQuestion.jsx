import React,{useEffect} from 'react'

const SecurityQuestion = ({ formData, handleInputChange,firstSecurityQuestion ,secondSecurityQuestion}) => {
    
  return (
    <>
        {firstSecurityQuestion && (
        <div className="input-with-icon">
            <label htmlFor="">{firstSecurityQuestion.question}</label>
            <input
                type="text"
                placeholder={"Enter Name"}
                name="security_answer_1"
                value={formData.security_answer_1}
                onChange={handleInputChange}
                required
            />
        </div>
            )}
         {secondSecurityQuestion && (
        <div className="input-with-icon">
            <label htmlFor="">{secondSecurityQuestion.question}</label>
            <input type="text" 
            placeholder='Enter Answer'
            value={formData.security_answer_2}
            onChange={handleInputChange}
            name='security_answer_2'
            required />

        </div>
         )}
        
    </>
  )
}

export default SecurityQuestion
