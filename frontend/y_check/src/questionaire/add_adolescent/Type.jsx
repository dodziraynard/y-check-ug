import React from 'react'

const Type = () => {
  return (
    <>
        <span> Select Adolescent Type</span>
        <div class="input-radio">
            <input type="radio" name="adolescent_type" value="primary" required/>
            <label for="primary-radio">Primary</label>
        </div>
        <div class="input-radio">
            <input type="radio" name="adolescent_type" value="secondary"  required/>
            <label for="secondary-radio">Secondary</label>
        </div>
        <div class="input-radio">
            <input type="radio" name="adolescent_type" value="community"  required/>
            <label for="community-radio">Community</label>
        </div>
        <span> Type of Visit:</span>
        <div class="input-radio">
            <label for="primary-radio">Initial</label>
            <input type="radio" name="visit_type" value="initial" required/>
        </div>
        <div class="input-radio">
            <label for="secondary-radio">1st Follow-up</label>
            <input type="radio" name="visit_type" value="1st Follow-up"  required/>
        </div>
    </>
  )
}

export default Type
