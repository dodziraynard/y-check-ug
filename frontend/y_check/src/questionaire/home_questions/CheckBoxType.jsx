import React from 'react'

const CheckBoxType = () => {
  return (
    <>
        <span>Choose your gender</span>
        <div className="input-checkbox">
            <label htmlFor="male-checkbox">Male</label>
            <input
                type="checkbox"
                id="male-checkbox"
                name="gender"
                value="Male"
                required
            />
        </div>
        <div className="input-checkbox">
            <label htmlFor="female-checkbox">Female</label>
            <input
                type="checkbox"
                id="female-checkbox"
                name="gender"
                value="Female"
                required
            />
        </div>
    </>

  )
}

export default CheckBoxType
