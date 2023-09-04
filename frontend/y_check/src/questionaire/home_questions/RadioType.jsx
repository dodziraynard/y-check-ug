import React from 'react'

const RadioType = ({ currentQuestions,setUserResponses }) => {
  const handleRadioChange = (questionId, selectedOption) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: selectedOption,
    }));
  };
    return (
      <div className='questionaire-text'>
        {currentQuestions.map((question) => (
          <div key={question.id}>
            <h2> {question.title}</h2>
            <span>{question.subtitle}</span>
            {question.options.map((option, index) => (
              <div className="input-radio" key={index}>
                <label htmlFor={`radio-${question.id}-${index}`}>{option}</label>
                <input
                  type="radio"
                  id={`radio-${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  required
                  onChange={() => handleRadioChange(question.title, option)}

                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default RadioType;
  