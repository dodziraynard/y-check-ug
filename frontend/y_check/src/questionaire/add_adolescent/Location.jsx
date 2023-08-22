import React from 'react'

const Location = ({ adolescentFormData, handleInputChange }) => {
  return (
    <div>
        <div className="input-select">
            <label htmlFor="Check_up_location">Select Check-up Location</label>
            <select 
            name="check_up_location" 
            value={adolescentFormData.check_up_location}
            onChange={handleInputChange}
            required>
                <option value="Madina">Madina</option>
                <option value="Legon">Legon</option>
                <option value="Adenta">Adenta</option>
            </select>
        </div>
        <div className="input-select">
            <label htmlFor="school">Select School</label>
            <select 
            name="school" 
            value={adolescentFormData.school}
            onChange={handleInputChange}
            required>
                <option value="UG Basic School">UG Basic School</option>
                <option value="UG Basic School">UG Basic School</option>
                <option value="UG Basic School">UG Basic School</option>
            </select>
        </div>
    </div>
  )
}

export default Location
