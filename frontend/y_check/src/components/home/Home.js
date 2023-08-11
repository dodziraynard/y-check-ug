import React from 'react'
import './home.scss'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { Link } from 'react-router-dom';
function Home() {
  return (
    <div className='home'>
      <div className='circle'>
        <div className='image'>
            <img src={ug_logo} alt="Logo" />
        </div>
        <div>
            <h2>Welcome</h2>
            <p>Y-Check Adolescent Questionaire</p>
        </div>
        <div>
            < Link to='/dashboard'><button >Login</button></Link>
            <button>Sign Up</button>
        </div>
      </div>
      <div className='mobile'>
            < Link to='/dashboard' style={{padding:'none',margin:'0'}}><button >Login</button></Link>
            <button>Sign Up</button>
        </div>
    </div>
  )
}

export default Home
