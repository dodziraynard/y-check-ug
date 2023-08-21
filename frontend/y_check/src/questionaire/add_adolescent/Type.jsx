import React from 'react'

const Type = () => {
  return (
    <>
        <span> Select Adolescent Type</span>
        <div className="input-radio">
            <input type="radio" name="adolescent_type" value="primary" required/>
            <label htmlFor="primary-radio">Primary</label>
        </div>
        <div class="input-radio">
            <input type="radio" name="adolescent_type" value="secondary"  required/>
            <label htmlFor="secondary-radio">Secondary</label>
        </div>
        <div className="input-radio">
            <input type="radio" name="adolescent_type" value="community"  required/>
            <label htmlFor="community-radio">Community</label>
        </div>
        <span> Type of Visit:</span>
        <div className="input-radio">
            <label htmlFor="primary-radio">Initial</label>
            <input type="radio" name="visit_type" value="initial" required/>
        </div>
        <div className="input-radio">
            <label htmlFor="secondary-radio">1st Follow-up</label>
            <input type="radio" name="visit_type" value="1st Follow-up"  required/>
        </div>
    </>
  )
}

export default Type
