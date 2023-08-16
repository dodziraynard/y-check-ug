import React from 'react'

const SecurityQuestion = () => {
  return (
    <>
        <div className="input-with-icon security-question">
            <label htmlFor="">Where do you live?</label>
            <input type="text" 
            placeholder='Eg: Mampong'
            name='town'
            required style={{width:'100%'}}/>
        </div>
        <div className="input-with-icon security-question">
            <label htmlFor="">What is your favorite food?</label>
            <input type="text" 
            placeholder='Eg: Akple'
            name='food'
            required style={{width:'100%'}}/>
        </div>
        
    </>
  )
}

export default SecurityQuestion
