import React from 'react'

const SecurityQuestion = () => {
  return (
    <>
      <span>Security Questions:</span>
        <div className="input-with-icon">
            <label htmlFor=""> where do you live?</label>
            <input type="text" 
            placeholder='Eg: Mampong'
            name='town'
            required/>
        </div>
        <div className="input-with-icon">
            <label htmlFor="">What is your Favorite food?</label>
            <input type="text" 
            placeholder='Eg: Akple'
            name='food'
            required/>
        </div>
        
    </>
  )
}

export default SecurityQuestion
