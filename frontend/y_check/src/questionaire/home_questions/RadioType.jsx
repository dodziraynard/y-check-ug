import React from 'react'

const RadioType = ({ currentQuestions ,question_options }) => {
  
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
            {question_options.map((option, index)=>(
              <div className="input-radio" key={index}>
                <label htmlFor={`option-${option.id}`}>{option.option}</label>
                <input
                  type='radio'
                  name={`question-${question.id}-options`}
                  id={`option-${option.id}`}
                  value={option.option}
                  required
                />
              </div>

            ))}
         
          </div>
        ))}
      </div>
    );
  };
  
  export default RadioType;
  