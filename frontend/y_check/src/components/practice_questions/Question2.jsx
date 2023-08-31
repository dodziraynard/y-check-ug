import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import sark from '../../images/sarkodie.jpeg'
import black from '../../images/black.webp'
import wale from '../../images/wale.jpeg'
import stone from '../../images/stone.jpeg'
import king from '../../images/king.jpeg'
import diana from '../../images/diana.jpeg'
import joe from '../../images/joe.jpeg'
import wendy from '../../images/wendy.jpeg'
import others from '../../images/others.jpg'

const Question2 = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    const handleImageClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const artists = [
        { name: 'Sarkodie', image: sark },
        { name: 'Black Sherrif', image: black },
        { name: 'Shatta Wale', image: wale },
        { name: 'StoneBwoy', image: stone },
        { name: 'King Promise', image: king },
        { name: 'Diana Hamilton', image: diana },
        { name: 'Joe Mettle', image: joe },
        { name: 'Wendy Shay', image: wendy },
        { name: 'Others', image: others },
        
    ];

  return (
    <div className='home'>
            <div className="questionaire-first-circle">
                <h2 className='question2'>Who are your favourite music artists??</h2>
                <div className='image-container'>
                {artists.map((artist, index) => (
                    <div
                    className={` ${activeIndex === index ? 'square-active' : ''}`}
                    onClick={() => handleImageClick(index)}
                    key={index}
                    >
                    <div className='artist-image'>
                        <img src={artist.image} alt="" />
                    </div>
                    <span className='artist-name'>{artist.name}</span>
                    </div>
                ))}  
                </div>
            </div>
           <Link to='/welcome'> <button className='circle-next-button'>Proceed</button></Link> 
    </div>
  )
}

export default Question2
