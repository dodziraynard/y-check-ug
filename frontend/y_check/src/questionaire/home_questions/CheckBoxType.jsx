import React from 'react';
import family from '../../images/family.png'

const CheckBoxType = ({ currentQuestions,question_options }) => {
  return (
    <>
      {currentQuestions.map((question) => (
        <>
          <div key={question.id}className='text-image'>
            <h2>{question.title} </h2>
            <img src={question.picture} alt="" />
          </div>
          <span>{question.title}</span>
          <div className="gender-container">
            {question_options.map((option, index) => (
              <div className="input-checkbox" key={index}>
                <input
                  type="checkbox"
                  id={`checkbox-${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option.option}
                  required
                />
                <label htmlFor={`checkbox-${question.id}-${index}`}>{option.option}</label>
              </div>
            ))}
          </div>
        </>
      ))}
    </>
  );
};

export default CheckBoxType;
