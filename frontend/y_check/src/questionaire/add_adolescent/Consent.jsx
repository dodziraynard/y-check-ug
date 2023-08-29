import React from 'react'

const Consent = ({ adolescentFormData, handleInputChange }) => {
    let locationJSX;
    if (adolescentFormData.adolescent_type === 'SC') {
        locationJSX = (
          <>
            <span> Select your School Year</span>
            <div className="input-radio">
                <input 
                type="radio" 
                name="year" 
                value="Year 1"
                checked={adolescentFormData.year === "Year 1"}
                onChange={handleInputChange} required/>
                <label htmlFor="primary-radio">Year 1</label>
            </div>
            <div className="input-radio">
                <input 
                type="radio" 
                name="year" 
                value="Year 2"  
                checked={adolescentFormData.year === "Year 2"}
                onChange={handleInputChange} 
                required/>
                <label htmlFor="secondary-radio">Year 2</label>
            </div>
            <div className="input-radio">
                <input 
                type="radio" 
                name="year" 
                value="Year 3"  
                checked={adolescentFormData.year === "Year 3"}
                onChange={handleInputChange} 
                required/>
                <label htmlFor="secondary-radio">Year 3</label>
            </div>
            <span> Confirmation of consent form received</span>
            <div className="input-radio">
                <input 
                type="radio" 
                name="consent" 
                value="Yes parental consent"
                checked={adolescentFormData.consent === "Yes parental consent"}
                onChange={handleInputChange} required/>
                <label htmlFor="consent">Yes parental consent</label>
            </div>
            <div className="input-radio">
                <input 
                type="radio" 
                name="consent" 
                value="Yes adolescent consent/assent"
                checked={adolescentFormData.consent === "Yes adolescent consent/assent"}
                onChange={handleInputChange} required/>
                <label htmlFor="consent">Yes adolescent consent/assent</label>
            </div>
            <div className="input-radio">
                <input 
                type="radio" 
                name="consent" 
                value="No"
                checked={adolescentFormData.consent === "No"}
                onChange={handleInputChange} required/>
                <label htmlFor="consent">No</label>
            </div>
          </>
        );
      } else {
        locationJSX = (
          <>
            <span> Confirmation of consent form received</span>
                <div className="input-radio">
                    <input 
                    type="radio" 
                    name="consent" 
                    value="Yes parental consent"
                    checked={adolescentFormData.consent === "Yes parental consent"}
                    onChange={handleInputChange} required/>
                    <label htmlFor="primary-radio">Yes parental consent</label>
                </div>
                <div className="input-radio">
                    <input 
                    type="radio" 
                    name="consent" 
                    value="Yes adolescent consent/assent"
                    checked={adolescentFormData.consent === "Yes adolescent consent/assent"}
                    onChange={handleInputChange} required/>
                    <label htmlFor="primary-radio">Yes adolescent consent/assent</label>
                </div>
                <div className="input-radio">
                    <input 
                    type="radio" 
                    name="consent" 
                    value="No"
                    checked={adolescentFormData.consent === "No"}
                    onChange={handleInputChange} required/>
                    <label htmlFor="primary-radio">No</label>
                </div>
          </>
        );
      }
  return (
    <>
      {locationJSX}  
    </>
  )
}

export default Consent
