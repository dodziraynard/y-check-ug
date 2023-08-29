import React from 'react'

const RadioType = () => {
  return (
    <>
       <span>Choose your gender</span>
        <div className="input-radio">
        <label htmlFor="primary-radio">Male</label>
        <input
            type="radio"
            name="gender"
            value="Yes"
            required/>
        </div>
        <div className="input-radio">
        <label htmlFor="primary-radio">Female</label>
        <input
            type="radio"
            name="gender"
            value="Yes"
            required/>
        </div>         
    </>
  )
}

export default RadioType
