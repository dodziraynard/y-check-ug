import React from 'react'
const InputType = ({ currentQuestions, setUserResponses }) => {
  const handleInputChange = (questionId, value) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  return (
    <>
      {currentQuestions.map((question, index) => (
        <div className='questionaire-text' key={index}>
          <h2>{question.title}</h2>
          <div className="questionaire-input">
            <input
              type="text"
              placeholder={`${question.subtitle}:`}
              name={question.title.toLowerCase()}
              required
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default InputType;
