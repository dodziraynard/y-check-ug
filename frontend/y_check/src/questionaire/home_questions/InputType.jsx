import React from 'react'

const InputType = ({ currentQuestions,setUserResponses }) => {
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
                placeholder={`Enter ${question.title}:`}
                name={question.title.toLowerCase()} 
                onChange={(e) => handleInputChange(question.title, e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </>
    );
};
export default InputType;
