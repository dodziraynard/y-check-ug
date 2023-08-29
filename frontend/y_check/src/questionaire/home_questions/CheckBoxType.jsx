import React from 'react';

const CheckBoxType = ({ currentQuestions }) => {
  return (
    <>
      {currentQuestions.map((question) => (
        <div key={question.id}>
          <span>{question.title}</span>
          <div className="gender-container">
            {question.options.map((option, index) => (
              <div className="input-checkbox" key={index}>
                <input
                  type="checkbox"
                  id={`checkbox-${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  required
                />
                <label htmlFor={`checkbox-${question.id}-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CheckBoxType;
