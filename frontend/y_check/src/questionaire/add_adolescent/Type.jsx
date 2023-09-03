import React from 'react'

const Type = ({ adolescentFormData, handleInputChange }) => {
  return (
    <>
        <span> Select Adolescent Type</span>
        <div className="input-radio">
            <input 
            type="radio" 
            name="adolescent_type" 
            value="PR"
            checked={adolescentFormData.adolescent_type === "PR"}
            onChange={handleInputChange} required/>
            <label htmlFor="primary-radio">Primary</label>
        </div>
        <div className="input-radio">
            <input 
            type="radio" 
            name="adolescent_type" 
            value="SC"  
            checked={adolescentFormData.adolescent_type === "SC"}
            onChange={handleInputChange} 
            required/>
            <label htmlFor="secondary-radio">Secondary</label>
        </div>
        <div className="input-radio">
            <input type="radio" 
            name="adolescent_type" 
            value="CM"  
            checked={adolescentFormData.adolescent_type === "CM"}
            onChange={handleInputChange} 
            required/>
            <label htmlFor="community-radio">Community</label>
        </div>
        
    </>
  )
}

export default Type
