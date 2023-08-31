import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import welcome from '../../images/welcome.png'
import pana from '../../images/pana.png'
import secret from '../../images/secret.png'
import help from '../../images/break.png'
import './welcome.scss'

const WelcomePage = () => {

    const carouselData = [
        {
          image: welcome,
          text: "Welcome to Y-Check!  <br />This screening tool has 11 parts,  <br /> each of which takes about 2 minutes.",
        },
        {
          image: pana,
          text: "Here will be a short break  <br /> after part 5 and we will play  <br /> a small game together.",
        },
        {
          image: secret,
          text: "Your answers will be kept confidential and <br /> your name will not be written anywhere  <br /> on this questionnaire.",
        },
        {
          image: help,
          text: "If you need a break, <br /> just tell the person that is helping you and  <br /> they will do some activities with you.",
        },
        // Add more carousel items as needed
    ];
    const [activeIndex, setActiveIndex] = useState(0);
  
    const changeSlide = () => {
        setActiveIndex((activeIndex + 1) % carouselData.length);
    };
    useEffect(() => {
        const interval = setInterval(changeSlide, 2000); // Change slide every 1 minute
        return () => clearInterval(interval);
    }, [activeIndex]);
    return (
        <div className='welcome'>
          <div className='welcome-circle'>
                <div className='welcome-image'>
                    <img src={carouselData[activeIndex].image} alt="Logo" />
                </div>
                <div className='welcome-text' dangerouslySetInnerHTML={{ __html: carouselData[activeIndex].text }}></div>

                <div className='welcome-small-circle-group'>
                    <div className='welcome-small-circle'></div>
                    <div className='welcome-small-circle'></div>
                    <div className='welcome-small-circle'></div>
                    <div className='welcome-small-circle'></div>
                </div>
          </div>
          <div className=''>
                < Link to='/questionaire' style={{padding:'none',margin:'0'}}><button className='welcome-button' >Proceed</button></Link>

            </div>
        </div>
      )
}

export default WelcomePage
