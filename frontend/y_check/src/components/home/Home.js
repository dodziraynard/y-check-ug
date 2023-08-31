import React from 'react'
import './home.scss'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import { Link } from 'react-router-dom';

function Home() {
  const array1 = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
  const array2 = [{ id: 3, name: 'Charlie' }, { id: 4, name: 'David' }];

  const mergedArray = [...array1, ...array2];
  console.log(mergedArray);



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
        <div className='login-button-group'>
            < Link to='/login'><button >Login</button></Link>
            < Link to='/register' style={{padding:'none',margin:'0'}}><button>Sign Up</button></Link>
        </div>
      </div>
      <div className='mobile'>
            < Link to='/login' style={{padding:'none',margin:'0'}}><button >Login</button></Link>
            < Link to='/register' style={{padding:'none',margin:'0'}}><button>Sign Up</button></Link>
            
        </div>
    </div>
  )
}

export default Home
