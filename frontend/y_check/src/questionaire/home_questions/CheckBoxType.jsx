import React from 'react'

const CheckBoxType = () => {
  return (
    <>
        <span>Choose your gender</span>
        <div className="gender-container">
            <div className="input-checkbox">
                <input
                    type="checkbox"
                    id="male-checkbox"
                    name="gender"
                    value="Male"
                    required
                />
                <label htmlFor="male-checkbox">Male</label>
            </div>
            <div className="input-checkbox">
                <input
                    type="checkbox"
                    id="female-checkbox"
                    name="gender"
                    value="Female"
                    required
                />
                <label htmlFor="female-checkbox">Female</label>
            </div>
            <div className="input-checkbox">
                <input
                    type="checkbox"
                    id="other-checkbox"
                    name="gender"
                    value="Other"
                    required
                />
                <label htmlFor="other-checkbox">Other</label>
            </div>
            <div className="input-checkbox">
                <input
                    type="checkbox"
                    id="prefer-not-to-say-checkbox"
                    name="gender"
                    value="Prefer Not to Say"
                    required
                />
                <label htmlFor="prefer-not-to-say-checkbox">Prefer Not to Say</label>
            </div>
        </div>
    </>

  )
}

export default CheckBoxType
