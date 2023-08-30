import React from 'react';
import family from '../../images/family.png'

const CheckBoxType = ({ currentQuestions }) => {
  return (
    <>
      {currentQuestions.map((question) => (
        <>
          <div key={question.id}className='text-image'>
            <h2>{question.title} </h2>
            <img src={family} alt="" />
          </div>
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
        </>
      ))}
    </>
  );
};

export default CheckBoxType;
