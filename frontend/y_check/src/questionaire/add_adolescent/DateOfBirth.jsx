import React from 'react'

const DateOfBirth = ({ adolescentFormData, handleInputChange,handleFileChange }) => {

// METHOD TO CALCULATE THE ADOLESCENT AGE
    const calculateAge = (birthDate) => {
        const today = new Date();
        const dob = new Date(birthDate);
        const age = today.getFullYear() - dob.getFullYear();
        
        if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            return age - 1;
        }
        
        return age;
    };
    const calculatedAge = adolescentFormData.date ? calculateAge(adolescentFormData.date) : '';
    const isEligible = calculatedAge >= 9 && calculatedAge <= 19;

    return (
        <>
            <span>Date of Birth</span>
            <div className="input-with-icon">
                <input
                    type="date"
                    name="date"
                    required
                    value={adolescentFormData.date}
                    onChange={handleInputChange}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div style={{ color: isEligible ? "green" : "red" }}>
                {calculatedAge !== '' && (
                    <p>
                        Age: {calculatedAge}{" "}
                        <span style={{ color: isEligible ? "green" : "red" }}>
                            {isEligible ? "Eligible" : "Not Eligible"}
                        </span>
                    </p>
                )}
            </div>
            {isEligible ? (
            <div>
                <span>You are  <strong style={{color:"green"}}>{calculatedAge}</strong> years old. Is that correct?</span>
                <div className="input-radio">
                <label htmlFor="primary-radio">Yes</label>
                <input
                    type="radio"
                    name="age_confirmation"
                    value="Yes"
                    checked={adolescentFormData.age_confirmation === "Yes"}
                    onChange={handleInputChange}
                    required
                />
                </div>

                <div className="input-radio">
                <label htmlFor="primary-radio">No</label>
                <input
                    type="radio"
                    name="age_confirmation"
                    value="No"
                    checked={adolescentFormData.age_confirmation === "No"}
                    onChange={handleInputChange}
                    required
                />
                </div>
            </div>
            ) : null}
            <span>Take Picture</span>
            <div className="input-with-icon">
                <input
                    type="file"
                    name="picture"
                    onChange={handleFileChange}
                    required
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </>
    );
};

export default DateOfBirth;
