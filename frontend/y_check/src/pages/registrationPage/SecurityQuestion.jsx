import React from 'react'

const SecurityQuestion = ({ formData, handleInputChange }) => {
  return (
    <>
        <div className="input-with-icon security-question">
            <label htmlFor="">Where do you live?</label>
            <input type="text" 
            placeholder='Eg: Mampong'
            name='town'
            value={formData.town}
            onChange={handleInputChange}
            required style={{width:'100%'}}/>
        </div>
        <div className="input-with-icon security-question">
            <label htmlFor="">What is your favorite food?</label>
            <input type="text" 
            placeholder='Eg: Akple'
            value={formData.food}
            onChange={handleInputChange}
            name='food'
            required style={{width:'100%'}}/>
        </div>
        
    </>
  )
}

export default SecurityQuestion
