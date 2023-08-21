import React from 'react'

const Location = () => {
  return (
    <div>
        <div className="input-select">
            <label htmlFor="visit-type">Select Check-up Location</label>
            <select name="visit-type" required>
                <option value="Madina">Madina</option>
                <option value="Legon">Legon</option>
                <option value="Adenta">Adenta</option>
            </select>
        </div>
        <div className="input-select">
            <label htmlFor="visit-type">Select School</label>
            <select name="visit-type" required>
                <option value="UG Basic School">UG Basic School</option>
                <option value="UG Basic School">UG Basic School</option>
                <option value="UG Basic School">UG Basic School</option>
            </select>
        </div>
    </div>
  )
}

export default Location
