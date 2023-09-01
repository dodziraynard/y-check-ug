import React, { useState,useEffect } from 'react';
import './question.scss'
import { Link } from 'react-router-dom';
const Question1 = () => {

    const [activeCircle, setActiveCircle] = useState(null);

    const handleCircleClick = (color) => {
        setActiveCircle(color === activeCircle ? null : color);
    };
    return (
        <div className='home'>
            <div className="questionaire-first-circle">
                <h2 className='question'>What is Your Favorite Color?</h2>
                <div
                    className={`circle pink ${activeCircle === 'pink' ? 'active2' : ''}`}
                    onClick={() => handleCircleClick('pink')}
                >
                    Pink
                </div>
                <div
                    className={`circle green ${activeCircle === 'green' ? 'active2' : ''}`}
                    onClick={() => handleCircleClick('green')}
                >
                    Green
                </div>
                <div
                 className={`circle yellow ${activeCircle === 'yellow' ? 'active2' : ''}`}
                 onClick={() => handleCircleClick('yellow')}
                > Yelow
                </div>
                <div
                className={`circle orange ${activeCircle === 'orange' ? 'active2' : ''}`}
                onClick={() => handleCircleClick('orange')}
                >Orange
                </div>
                <div
                 className={`circle purple ${activeCircle === 'purple' ? 'active2' : ''}`}
                 onClick={() => handleCircleClick('purple')}
                >Purple
                </div>
                <div 
                className={`circle black ${activeCircle === 'black' ? 'active2' : ''}`}
                onClick={() => handleCircleClick('black')}
                >Black
                </div>
                <div 
                className={`circle blue ${activeCircle === 'blue' ? 'active2' : ''}`}
                onClick={() => handleCircleClick('blue')}
                >Blue
                </div>
                <div 
                className={`circle red ${activeCircle === 'red' ? 'active2' : ''}`}
                onClick={() => handleCircleClick('red')}
                >Red
                </div>
            </div>
           <Link to='/practice-question-2'> <button className='circle-next-button'>Next Question</button></Link> 
        </div>
    );
}

export default Question1
