import React from 'react'

const RadioType = ({ currentQuestions }) => {
  
    return (
      <>
        {currentQuestions.map((question) => (
          <div key={question.id}>
            <span>{question.title}</span>
            {question.options.map((option, index) => (
              <div className="input-radio" key={index}>
                <label htmlFor={`radio-${question.id}-${index}`}>{option}</label>
                <input
                  type="radio"
                  id={`radio-${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  required
                />
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };
  
  export default RadioType;
  