import React from 'react'

const DateOfBirth = ({ adolescentFormData, handleInputChange }) => {

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
            <span>Select Gender:</span>
            <div className="input-radio">
                <label htmlFor="primary-radio">Male</label>
                <input
                type="radio"
                name="gender"
                value="Male"
                checked={adolescentFormData.gender === "Male"}
                onChange={handleInputChange}
                required
                />
            </div>
            <div className="input-radio">
                <label htmlFor="secondary-radio">Female</label>
                <input
                type="radio"
                name="gender"
                value="Female"
                checked={adolescentFormData.gender === "Female"}
                onChange={handleInputChange}
                required
                />
            </div>
            <span>Take Picture</span>
            <div className="input-with-icon">
                <input type="file" name="picture" required style={{ cursor: 'pointer' }} />
            </div>
        </>
    );
};

export default DateOfBirth;
