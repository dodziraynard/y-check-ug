import React from 'react'

const InputType = () => {
  return (
    <>
      <span> Surname</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Enter Surname:'
            name='surname'
            required/>
        </div>
    </>
  )
}

export default InputType
