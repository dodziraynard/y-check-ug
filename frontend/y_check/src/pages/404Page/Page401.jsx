import React from 'react'
import './error.scss'
import main from '../../images/401.png'
import { Link } from 'react-router-dom'
const Page401 = () => {
  return (
    <div className="unauthorized">
        <div className="fof-images">
            <img src={main} alt="Logo" className="fof-image1"/>
        </div>
        <h1>UNAUTHORIZED ACCESSS</h1>
        <p> You have attempted to access a page<br/>
        for which you are not authorized.</p>
       <Link to='/' style={{textDecoration:"none"}}><button className="home-btn"> GO TO HOMEPAGE</button></Link> 
    </div>
  )
}

export default Page401
