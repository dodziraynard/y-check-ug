import React from 'react'

const InputType = ({ currentQuestions }) => {
    return (
      <>
        {currentQuestions.map((question, index) => (
          <div key={index}>
            <span>{question.title}</span>
            <div className="input-with-icon">
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
