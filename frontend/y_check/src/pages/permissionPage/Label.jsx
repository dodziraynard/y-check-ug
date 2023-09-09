import React from 'react'
import { Link } from 'react-router-dom'

const Label = () => {
    return (
        <div className='patient question-filter option-filter'>
            <div className="filter">
                <div className="filter-items">
                    <div className="filter-item">
                      <Link to='/add_question' style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>Add Question</span></Link>  
                    </div>
                    <div className="filter-item">
                       <Link to='/add_option' style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>Add Option</span></Link> 
                    </div>
                   
                </div>
            </div>
        </div>
  )
}


export default Label
