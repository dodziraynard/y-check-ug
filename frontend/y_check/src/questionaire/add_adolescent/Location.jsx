import React from 'react';

const Location = ({ adolescentFormData, handleInputChange }) => {
  let locationJSX;

  if (adolescentFormData.adolescent_type === 'Primary') {
    locationJSX = (
      <div className="input-select">
        <label htmlFor="check_up_location">Select check-up location</label>
        <select
          name="check_up_location"
          value={adolescentFormData.check_up_location}
          onChange={handleInputChange}
          required
        >
          <option value="Kwaprow MA Basic School">Kwaprow MA Basic School</option>
          <option value="Ekon MA Basic School">Ekon MA Basic School</option>
          <option value="Efutu Basic School">Efutu Basic School</option>
        </select>
      </div>
    );
  } else if (adolescentFormData.adolescent_type === 'Secondary') {
    locationJSX = (
      <div className="input-select">
        <label htmlFor="check_up_location">Select check-up location</label>
        <select
          name="check_up_location"
          value={adolescentFormData.check_up_location}
          onChange={handleInputChange}
          required
        >
          <option value="Efutu High Senior Technical School">Efutu High Senior Technical School</option>
          <option value="Ogua High School Technical School">Ogua High School Technical School</option>
          <option value="Ghana national Senior High School">Ghana national Senior High School</option>
          <option value="University Practice Senior High School">University Practice Senior High School</option>
        </select>
      </div>
    );
  } else {
    locationJSX = (
      <div className="input-select">
        <label htmlFor="check_up_location">Select check-up location</label>
        <select
          name="check_up_location"
          value={adolescentFormData.check_up_location}
          onChange={handleInputChange}
          required
        >
          <option value="Efutu">Efutu</option>
          <option value="Kwaprow">Kwaprow</option>
          <option value="Ekon">Ekon</option>
          <option value="Abura">Abura</option>
        </select>
      </div>
    );
  }

  return (
    <>
      {locationJSX}
      <span> Type of Visit:</span>
        <div className="input-radio">
            <label htmlFor="primary-radio">Pilot/pre-testing</label>
            <input 
            type="radio" 
            name="visit_type" 
            value="Pilot/pre-testing" 
            checked={adolescentFormData.visit_type === "Pilot/pre-testing"}
            onChange={handleInputChange} 
            required/>
        </div>
        <div className="input-radio">
            <label htmlFor="primary-radio">Initial check- up</label>
            <input 
            type="radio" 
            name="visit_type" 
            value="Initial check- up" 
            checked={adolescentFormData.visit_type === "Initial check- up"}
            onChange={handleInputChange} 
            required/>
        </div>
        <div className="input-radio">
            <label htmlFor="secondary-radio">Follow-up</label>
            <input type="radio" 
            name="visit_type" 
            value="Follow-up" 
            checked={adolescentFormData.visit_type === "Follow-up"}
            onChange={handleInputChange} 
            required/>
        </div>
    </>
  );
};

export default Location;
