import React from 'react'

const Type = ({ adolescentFormData, handleInputChange }) => {
  return (
    <>
        <span> Select Adolescent Type</span>
        <div className="input-radio">
            <input 
            type="radio" 
            name="adolescent_type" 
            value="Primary"
            checked={adolescentFormData.adolescent_type === "Primary"}
            onChange={handleInputChange} required/>
            <label htmlFor="primary-radio">Primary</label>
        </div>
        <div className="input-radio">
            <input 
            type="radio" 
            name="adolescent_type" 
            value="Secondary"  
            checked={adolescentFormData.adolescent_type === "Secondary"}
            onChange={handleInputChange} 
            required/>
            <label htmlFor="secondary-radio">Secondary</label>
        </div>
        <div className="input-radio">
            <input type="radio" 
            name="adolescent_type" 
            value="Community"  
            checked={adolescentFormData.adolescent_type === "Community"}
            onChange={handleInputChange} 
            required/>
            <label htmlFor="community-radio">Community</label>
        </div>
        <span> Type of Visit:</span>
        <div className="input-radio">
            <label htmlFor="primary-radio">Initial</label>
            <input 
            type="radio" 
            name="visit_type" 
            value="Initial" 
            checked={adolescentFormData.visit_type === "Initial"}
            onChange={handleInputChange} 
            required/>
        </div>
        <div className="input-radio">
            <label htmlFor="secondary-radio">1st Follow-up</label>
            <input type="radio" 
            name="visit_type" 
            value="1st Follow-up" 
            checked={adolescentFormData.visit_type === "1st Follow-up"}
            onChange={handleInputChange} 
            required/>
        </div>
    </>
  )
}

export default Type
