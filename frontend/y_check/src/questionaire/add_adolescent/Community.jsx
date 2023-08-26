import React from 'react'

const Community = ({ adolescentFormData, handleInputChange }) => {
  return (
    <>
    <span>Tell us about yourself:</span>
        <div className="input-radio">
            <label htmlFor="primary-radio">Boy</label>
            <input
            type="radio"
            name="gender"
            value="Boy"
            checked={adolescentFormData.gender === "Boy"}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="input-radio">
            <label htmlFor="secondary-radio">Girl</label>
            <input
            type="radio"
            name="gender"
            value="Girl"
            checked={adolescentFormData.gender === "Girl"}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="input-select">
            <label htmlFor="community">Which community do you live in?</label>
            <select 
            name="community" 
            value={adolescentFormData.community}
            onChange={handleInputChange}
            required>
                <option value="Efutu">Efutu</option>
                <option value="Kwaprow">Kwaprow</option>
                <option value="Ekon">Ekon</option>
                <option value="Abura">Abura</option>
            </select>
        </div>
        
    </>
  )
}

export default Community
