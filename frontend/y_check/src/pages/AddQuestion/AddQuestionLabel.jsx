import React from 'react'
import { Link } from 'react-router-dom'

const AddQuestionLabel = () => {
    return (
        <div className='patient'>
            <div className="filter">
                <div className="filter-items">
                    <div className="filter-item">
                      <Link to='/add_school' style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>Basic School</span></Link>  
                    </div>
                    <div className="filter-item">
                       <Link to='/add_shs' style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>Snr High School</span></Link> 
                    </div>
                    <div className="filter-item">
                    <Link to='/add_community'style={{textDecoration:"none", color:"#173D70"}}><span style={{cursor:"pointer"}}>Community</span></Link> 
                    </div>
                   
                </div>
            </div>
        </div>
  )
}


export default AddQuestionLabel
