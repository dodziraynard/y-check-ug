import React from 'react'
import { Link } from 'react-router-dom'

const Label = () => {
    return (
        <div className='patient question-filter option-filter'>
            <div className="filter">
                <div className="filter-items">
                    <div className="filter-item">
                      <Link to='/permission-page' style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>give Question</span></Link>  
                    </div>
                    <div className="filter-item">
                       <Link to='' style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>Add Option</span></Link> 
                    </div>
                   
                </div>
            </div>
        </div>
  )
}


export default Label
