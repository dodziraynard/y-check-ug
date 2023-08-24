import React from 'react'

const PIP = ({ adolescentFormData, handleInputChange }) => {
  return (
    <>
        <span>PIP Number</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='YC1001'
            name='PIP'
            required
            disabled/>
        </div>
        <span> Surname</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Enter Surname:'
            name='surname'
            value={adolescentFormData.surname}
            onChange={handleInputChange}
            required/>
        </div>
        <span> Other Names</span>
        <div className="input-with-icon">
            <input type="text" 
            placeholder='Enter Other Names:'
            name='other_names'
            value={adolescentFormData.other_names}
            onChange={handleInputChange}
            required/>
        </div>
    </>
  )
}

export default PIP
