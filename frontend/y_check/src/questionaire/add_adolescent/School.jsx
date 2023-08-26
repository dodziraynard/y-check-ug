import React from 'react'

const School = ({ adolescentFormData, handleInputChange }) => {
  return (
    <>
      <div className="input-select">
            <label htmlFor="school">Select School</label>
            <select 
            name="school" 
            value={adolescentFormData.school}
            onChange={handleInputChange}
            required>
                <option value="Kwaprow MA Basic School">Kwaprow MA Basic School</option>
                <option value="Ekon MA Basic School">Ekon MA Basic School</option>
                <option value="Efutu Basic School">Efutu Basic School</option>
            </select>
        </div>
      <div className="input-select">
            <label htmlFor="school">Select School</label>
            <select 
            name="school" 
            value={adolescentFormData.school}
            onChange={handleInputChange}
            required>
                <option value="Efutu High Senior Technical School">Efutu High Senior Technical School</option>
                <option value="Ogua High School Technical School">Ogua High School Technical School</option>
                <option value="Ghana national Senior High School">Ghana national Senior High School</option>
                <option value="University Practice Senior High School">University Practice Senior High School</option>
                
            </select>
        </div>
        <span>School resident status:</span>
        <div className="input-radio">
            <label htmlFor="primary-radio">Boarding</label>
            <input
            type="radio"
            name="resident_status"
            value="Boarding"
            checked={adolescentFormData.resident_status === "Boarding"}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="input-radio">
            <label htmlFor="primary-radio">Day</label>
            <input
            type="radio"
            name="resident_status"
            value="Day"
            checked={adolescentFormData.resident_status === "Day"}
            onChange={handleInputChange}
            required
            />
        </div>
        
    </>
  )
}

export default School
