import React from 'react'
import Icon from '@mdi/react';
import { mdiMapMarker,mdiFoodApple } from '@mdi/js';
const SecurityQuestion = ({ formData, handleInputChange }) => {
  return (
    <>
        <div className="input-with-icon">
            <label htmlFor="">Where do you live?</label>
            <input type="text" 
            placeholder='Eg: Mampong'
            name='town'
            value={formData.town}
            onChange={handleInputChange}
            required />

        </div>
        <div className="input-with-icon">
            <label htmlFor="">What is your favorite food?</label>
            <input type="text" 
            placeholder='Eg: Akple'
            value={formData.food}
            onChange={handleInputChange}
            name='food'
            required />

        </div>
        
    </>
  )
}

export default SecurityQuestion
