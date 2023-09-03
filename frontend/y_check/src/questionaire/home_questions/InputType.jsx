import React from 'react'

const InputType = ({ currentQuestions }) => {
    return (
      <>
        {currentQuestions.map((question, index) => (
          <div className='questionaire-text' key={index}>
            <h2>{question.title}</h2>
            <div className="questionaire-input">
              <input
                type="text"
                placeholder={`Enter ${question.title}:`}
                name={question.title.toLowerCase()} 
                required
              />
            </div>
          </div>
        ))}
      </>
    );
};
export default InputType;
