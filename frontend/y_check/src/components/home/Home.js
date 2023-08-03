import React from 'react'
import './home.scss'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
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
            <button>Login</button>
            <button>Sign Up</button>
        </div>
      </div>
      <div className='mobile'>
            <button>Login</button>
            <button>Sign Up</button>
        </div>
    </div>
  )
}

export default Home
