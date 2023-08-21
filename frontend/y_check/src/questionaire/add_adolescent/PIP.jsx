import React from 'react'

const PIP = () => {
  return (
    <>
        <span>PIP Number</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Eg: YC1001'
            name='PIP'
            required
            disabled/>
        </div>
        <span> Surname</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Enter Surname:'
            name='surname'
            required/>
        </div>
        <span> Other Names</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Enter Other Names:'
            name='other_names'
            required/>
        </div>
    </>
  )
}

export default PIP
