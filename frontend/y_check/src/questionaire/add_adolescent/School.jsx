import React from 'react'

const School = ({ adolescentFormData, handleInputChange,schools,shs_schools }) => {
    let locationJSX;
    if (adolescentFormData.adolescent_type === 'PR') {
        locationJSX = (
            <div className="input-select">
            <label htmlFor="school">Select School</label>
            <select 
            name="school" 
            value={adolescentFormData.school}
            onChange={handleInputChange}
            required>
                <option value=""> None</option>
                {schools.map((school) => (
                <option key={school.id} value={school.school_name}>
                  {school.school_name}
                </option>
                ))}       
            </select>
        </div>
        );
      } else {
        locationJSX = (
          <>
                <div className="input-select">
                <label htmlFor="school">Select School</label>
                <select 
                name="school" 
                value={adolescentFormData.school}
                onChange={handleInputChange}
                required>
                    <option value=""> None</option>
                    {shs_schools.map((shs) => (
                    <option key={shs.id} value={shs.school_name}>
                      {shs.school_name}
                    </option>
                    ))}       
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
        );
    }

  return (
    <>
      {locationJSX}  
    </>
  )
}

export default School
