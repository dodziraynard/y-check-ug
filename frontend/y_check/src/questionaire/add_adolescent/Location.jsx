import React from 'react';

const Location = ({ adolescentFormData, handleInputChange, schools, communities,shs_schools}) => {
  let locationJSX;


  if (adolescentFormData.adolescent_type === 'PR') {
    locationJSX = (
      <div className="input-select">
        <label htmlFor="check_up_location">Select check-up location</label>
        <select
          name="check_up_location"
          value={adolescentFormData.check_up_location}
          onChange={handleInputChange}
          required
        >
          <option value=""> None</option>
          {schools.map((school) => (
          <option key={school.id} value={school.school_name}>
            {school.school_name}
          </option>
          ))}        
        </select>
      </div>
    );
  } else if (adolescentFormData.adolescent_type === 'SC') {
    locationJSX = (
      <div className="input-select">
        <label htmlFor="check_up_location">Select check-up location</label>
        <select
          name="check_up_location"
          value={adolescentFormData.check_up_location}
          onChange={handleInputChange}
          required
        >
        <option value=""> None</option>
         {shs_schools.map((shs) => (
          <option key={shs.id} value={shs.school_name}>
            {shs.school_name}
          </option>
          ))}       
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
         {communities.map((community) => (
          <option key={community.id} value={community.community_name}>
            {community.community_name}
          </option>
          ))}       
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
